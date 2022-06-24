/* eslint-disable no-const-assign */
import React, { useEffect, useState, useRef } from 'react';
import GrammarData from 'components/Grammar/data';

const Blogs = () => {

  return (
    <div className="container pb-8" style={{background: 'white'}}>
      <GrammarData isAdmin={true} />
    </div>
  );
};

export default Blogs;
