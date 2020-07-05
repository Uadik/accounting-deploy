import React from 'react';

const Tab = props => {
  const { onTabClick, activeTab, label } = props;

  let className = 'tab-list-item';
  className += activeTab === label ? ' tab-list-active' : '';

  return (
    <li className={className} onClick={() => onTabClick(label)}>
      {label}
    </li>
  );
};

export default Tab;
