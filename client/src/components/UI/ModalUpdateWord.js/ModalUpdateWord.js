/* eslint-disable react/jsx-key */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import LoopIcon from '@material-ui/icons/Loop';
import InputCustom from 'components/UI/InputCustom';
import useStyle from './style';
import SelectCustom from 'components/UI/SelectCustom';
import { useForm } from 'react-hook-form';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { yupResolver } from '@hookform/resolvers/yup';
import { MAX, ROLE_TYPES, WORD_TYPES, WORD_LEVELS, WORD_SPECIALTY } from 'constant';
import PhoneticInput from 'components/Contribution/Word/PhoneticInput';
import * as yup from 'yup';
import InformationTooltip from 'components/Contribution/Word/InformationTooltip';
import UploadButton from 'components/UI/UploadButton';
import TopicSelect from 'components/UI/TopicSelect';
import { debounce } from 'helper';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from 'redux/slices/message.slice';
import Grid from '@material-ui/core/Grid';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import axios from 'axios';
import CancelIcon from '@material-ui/icons/Cancel';


let delayTimer = null;

const schema = yup.object().shape({
  word: yup
    .string()
    .trim()
    .required('Hãy nhập một từ vào đây')
    .lowercase()
    .max(MAX.WORD_LEN, `Từ dài tối đã ${MAX.WORD_LEN} ký tự`),
  mean: yup
    .string()
    .trim()
    .lowercase()
    .required('Hãy nhập ý nghĩa từ')
    .max(MAX.MEAN_WORD_LEN, `Từ dài tối đã ${MAX.MEAN_WORD_LEN} ký tự`),
  phonetic: yup
    .string()
    .trim()
    .lowercase()
    .required('Hãy nhập ký âm của từ')
    .max(MAX.PHONETIC_LEN, `Từ dài tối đã ${MAX.PHONETIC_LEN} ký tự`),
  type: yup
    .string()
    .required('Chọn loại của từ')
    .oneOf(WORD_TYPES.map((i) => i.value)),
  level: yup
    .string()
    .required('Chọn cấp bậc của từ')
    .oneOf(WORD_LEVELS.map((i) => i.value)),
  specialty: yup
    .string()
    .required('Chọn cấp bậc của từ')
    .oneOf(WORD_SPECIALTY.map((i) => i.value)),
  examples: yup
    .string()
    .max(MAX.EXAMPLE_WORD_LEN, `Ví dụ tối đa ${MAX.EXAMPLE_WORD_LEN} ký tự`),
  synonyms: yup
    .string()
    .max(
      MAX.SYNONYMS_WORD_LEN,
      `Từ đồng nghĩa tối đa ${MAX.SYNONYMS_WORD_LEN} ký tự`,
    ),
  antonyms: yup
    .string()
    .max(
      MAX.SYNONYMS_WORD_LEN,
      `Từ trái nghĩa tối đa ${MAX.SYNONYMS_WORD_LEN} ký tự`,
    ),
});
function ModalUpdateWord({ open, item, onClose, onRegister, loading }) {
  const topics = useRef([]);
  console.log('item', item);
  const { refresh_token } = useSelector((state) => state.token);
  const [imageWord, setImageWord] = useState(item.picture || null);
  const classes = useStyle();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleCheckWordExistence = (eWord, eType) => {
    delayTimer = debounce(
      delayTimer,
      async () => {
        try {
          const word = eWord ? eWord.target?.value : getValues('word'),
            type = eType ? eType.target?.value : getValues('type');

          const apiRes = await wordApi.getCheckWordExistence(word, type);
          if (apiRes.status === 200) {
            const { isExist = false } = apiRes.data;
            if (isExist) {
              dispatch(
                setMessage({
                  type: 'warning',
                  message: `Từ ${word} (${type}) đã tồn tại trong Dynonary !`,
                  duration: 2000,
                }),
              );
            }
          }
        } catch (error) { }
      },
      1000,
    );
  };
  const changeWordImage = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/uploadWordImage', formData, {
        headers: { 'content-type': 'multipart/form-data', Authorization: refresh_token }
      });
      console.log('res', res);
      if (res.status = 200) {
        dispatch(
          setMessage({ message: 'Cập nhật ảnh cho từ vựng thành công !', type: 'success' }),
        );
        setImageWord(res?.data?.url);
      }

    } catch (err) {
      console.log('err', err);
      dispatch(
        setMessage({ message: 'Cập nhật ảnh thất bại', type: 'error' }),
      );
    }
  }

  const onSubmit = (data) => {
    onRegister({ ...data, topics: topics.current, picture: imageWord });
  };
  const deleteImages = () => {
    setImageWord(null);
  };
  console.log('imageWord', imageWord);
  return (
    <Dialog
      classes={{
        paper: classes.rootPaper,
      }}
      onClose={onClose}
      aria-labelledby="setting dialog"
      disableBackdropClick={true}
      maxWidth="md"
      open={open}>
      <div className={`${classes.title} flex-center-between`}>
        <span>Cập nhật từ vựng</span>
        <CloseIcon className="cur-pointer" onClick={onClose} />
      </div>

      <DialogContent classes={{ root: classes.content }}>
        <form
          className={`${classes.root} flex-col`}
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off">
          <Grid className={classes.grid} container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <InputCustom
                label="word"
                className="w-100"
                size="small"
                placeholder="Nhập tên"
                error={Boolean(errors.word)}
                defaultValue={item?.word}
                inputProps={{
                  name: 'word',
                  autoFocus: true,
                  ...register('word'),
                }}
                onChange={(e) => handleCheckWordExistence(e, null)}
              />
              {errors.word && <p className="text-error">{errors?.word?.message}</p>}
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <InputCustom
                className="w-100"
                label="Nghĩa của từ (*)"
                size="small"
                error={Boolean(errors.mean)}
                defaultValue={item?.mean}
                inputProps={{
                  maxLength: MAX.MEAN_WORD_LEN,
                  name: 'mean',
                  ...register('mean'),
                }}
              />
              {errors.mean && (
                <p className="text-error">{errors.mean?.message}</p>
              )}
            </Grid>

            <PhoneticInput
              className="w-100"
              errorMessage={errors.phonetic?.message}
              error={Boolean(errors.phonetic)}
              value={item?.phonetic}
              size="small"
              inputProps={{
                maxLength: MAX.PHONETIC_LEN,
                name: 'phonetic',
              }}
              register={register('phonetic')}
            />

            <Grid item xs={12} md={6} lg={4}>
              <SelectCustom
                className="w-100"
                size="small"
                label="Loại từ (*)"
                options={WORD_TYPES}
                error={Boolean(errors.type)}
                defaultValue={item?.type}
                inputProps={{
                  name: 'type',
                  ...register('type'),
                }}
                onChange={(e) => handleCheckWordExistence(null, e)}
              />
              {errors.type && (
                <p className="text-error">{errors.type?.message}</p>
              )}
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <SelectCustom
                className="w-100"
                size="small"
                label="Cấp bậc của từ (*)"
                options={WORD_LEVELS}
                error={Boolean(errors.level)}
                defaultValue={item?.level}
                inputProps={{ name: 'level', ...register('level') }}
              />
              {errors.level && (
                <p className="text-error">{errors.level?.message}</p>
              )}
            </Grid>

            {/* word specialty */}
            <Grid item xs={12} md={6} lg={4}>
              <SelectCustom
                className="w-100"
                size="small"
                label="Thuộc chuyên ngành"
                options={WORD_SPECIALTY}
                error={Boolean(errors.specialty)}
                defaultValue={item?.specialty}
                inputProps={{
                  name: 'specialty',
                  ...register('specialty'),
                }}
              />
              {errors.specialty && (
                <p className="text-error">{errors.specialty?.message}</p>
              )}
            </Grid>

            {/* examples */}
            <Grid item xs={12} md={6} lg={4}>
              <InputCustom
                className="w-100"
                label="Câu ví dụ"
                size="small"
                multiline
                defaultValue={item?.examples}
                endAdornment={
                  <InformationTooltip title="Thêm các câu ví dụ cho từ trên. Đảm bảo có sự xuất hiện của từ đó trong câu. Bạn có thể thêm nhiều câu bằng cách xuống dòng." />
                }
                error={Boolean(errors.examples)}
                inputProps={{
                  name: 'examples',
                  ...register('examples'),
                }}
              />

              {errors.examples && (
                <p className="text-error">{errors.examples?.message}</p>
              )}
            </Grid>

            {/* synonyms */}
            <Grid item xs={12} md={6} lg={4}>
              <InputCustom
                className="w-100"
                size="small"
                label="Các từ đồng nghĩa"
                multiline
                error={Boolean(errors.synonyms)}
                defaultValue={item?.synonyms}
                inputProps={{
                  name: 'synonyms',
                  ...register('synonyms'),
                }}
              />
              {errors.synonyms && (
                <p className="text-error">{errors.synonyms?.message}</p>
              )}
            </Grid>

            {/* antonyms */}
            <Grid item xs={12} md={6} lg={4}>
              <InputCustom
                className="w-100"
                size="small"
                label="Các từ trái nghĩa"
                defaultValue={item?.antonyms}
                multiline
                error={Boolean(errors.antonyms)}
                inputProps={{
                  name: 'antonyms',
                  ...register('antonyms'),
                }}
              />
              {errors.antonyms && (
                <p className="text-error">{errors.antonyms?.message}</p>
              )}
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <InputCustom
                className="w-100"
                size="small"
                label="Ghi chú"
                multiline
                defaultValue={item?.note}
                endAdornment={
                  <InformationTooltip title="Nhập thêm ghi chú mà bạn muốn cho từ. Thêm nhiều dòng bằng cách xuống dòng." />
                }
                error={Boolean(errors.note)}
                inputProps={{
                  name: 'note',
                  ...register('note'),
                }}
              />
              {errors.note && (
                <p className="text-error">{errors.note?.message}</p>
              )}
            </Grid>

            {/* word topics */}
            <Grid item xs={12} md={6} lg={4}>

              <TopicSelect
                onChange={(topicList) => (topics.current = topicList)}
                size="small"
                buttonTitle="Thêm chủ đề"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <>
                <input
                  className={classes.hidden}
                  accept="image/*"
                  id="button-file"
                  htmlFor="contained-button-file"
                  type="file"
                  onChange={changeWordImage}
                />
                <label htmlFor="button-file">
                  <Button
                    style={{ marginLeft: 0 }}
                    className={`${classes.btn} w-100 h-100`}
                    variant="contained"
                    color="primary"
                    component="span"
                    endIcon={<CloudUploadIcon />}>
                    Ảnh minh hoạ
                  </Button>
                </label>
              </>
            </Grid>

            <Grid item xs={12} md={12} lg={12}>
              <ImageList cols={3} rowHeight={164}>
                {
                  imageWord && (
                    <ImageListItem key="image">
                      <img
                        src={imageWord ? imageWord : URL.createObjectURL(imageWord)}
                        srcSet={imageWord ? imageWord : URL.createObjectURL(imageWord)}
                        alt="image"
                        loading="lazy"
                      />
                      <CancelIcon className={`${classes.btn_close}`} onClick={() => deleteImages()} />
                    </ImageListItem>
                  )
                }
              </ImageList>
            </Grid>

          </Grid>
          <Button
            className="_btn _btn-primary mt-8"
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading && <LoopIcon className="ani-spin" />}
            size="large">
            Cập nhật thông tin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ModalUpdateWord.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.any,
  onRegister: PropTypes.func,
  loading: PropTypes.bool,
};

ModalUpdateWord.defaultProps = {
  onClose: function () { },
  open: false,
};

export default ModalUpdateWord;
