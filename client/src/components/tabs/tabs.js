import React, { useState } from 'react';
import Tab from './tab';

import './tabs.css';

const Tabs = props => {
  const [state, setState] = useState({
    activeTab: props.children[0].props.label
  });

  return (
    <div className="tabs">
      <ol className="tab-list">
        {props.children.map(child => {
          const { label } = child.props;

          return (
            <Tab
              activeTab={state.activeTab}
              key={label}
              label={label}
              onTabClick={tabLabel => {
                if (state.activeTab !== tabLabel)
                  setState({ activeTab: tabLabel });
              }}
            />
          );
        })}
      </ol>
      <div className="tab-content">
        {props.children.map(child => {
          if (child.props.label !== state.activeTab) return undefined;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

export default Tabs;
