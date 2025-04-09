// src/components/PhotoBooth/FilterModule.js
import React, { useState, useEffect } from 'react';

// 扁平化滤镜列表 - 不包含随机滤镜，供随机选择使用
const BASE_FILTERS = [
  { id: 'none', name: 'No Filter', value: 'none' },
  { id: 'grayscale', name: 'Grayscale', value: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', value: 'sepia(100%)' },
  
  // Vintage and effect filters
  { 
    id: 'vintage', 
    name: 'Vintage', 
    value: 'grayscale(100%) contrast(120%) brightness(110%) sepia(30%) hue-rotate(10deg) blur(0.4px)' 
  },
  // Warm sunlight effect
  { 
    id: 'soleado', 
    name: 'Sunny', 
    value: 'brightness(120%) contrast(110%) saturate(130%) sepia(30%) hue-rotate(10deg)' 
  },
  // Soft focus effect
  { 
    id: 'enfoqueSuave', 
    name: 'Soft Focus', 
    value: 'brightness(105%) contrast(95%) blur(0.7px)' 
  },
  // Pink effect
  { 
    id: 'rosa', 
    name: 'Pink', 
    value: 'brightness(105%) contrast(110%) saturate(130%) hue-rotate(-30deg)' 
  },
  // Vintage blue tone
  { 
    id: 'retro', 
    name: 'Retro', 
    value: 'brightness(100%) contrast(120%) saturate(110%) hue-rotate(180deg) sepia(20%)' 
  },
  // Cocoa tone
  { 
    id: 'cacao', 
    name: 'Cocoa', 
    value: 'sepia(60%) brightness(105%) contrast(110%) saturate(90%)' 
  },
  // Professional filter
  { 
    id: 'proX', 
    name: 'Pro X', 
    value: 'brightness(110%) contrast(115%) saturate(120%) hue-rotate(5deg)' 
  },
  // Green filter
  { 
    id: 'envidia', 
    name: 'Emerald', 
    value: 'brightness(105%) contrast(110%) saturate(120%) hue-rotate(70deg)' 
  },
  // Zinc gray effect
  { 
    id: 'zinc', 
    name: 'Zinc', 
    value: 'grayscale(90%) brightness(110%) contrast(110%) saturate(20%)' 
  },
  // Soft filter
  { 
    id: 'soft', 
    name: 'Soft', 
    value: 'brightness(130%) contrast(105%) saturate(80%) blur(0.3px)' 
  },
  // Vivid filter
  { 
    id: 'vivid', 
    name: 'Vivid', 
    value: 'brightness(120%) contrast(120%) saturate(150%) hue-rotate(20deg)' 
  },
  // Moody filter
  { 
    id: 'moody', 
    name: 'Moody', 
    value: 'brightness(90%) contrast(110%) saturate(90%) hue-rotate(-10deg)' 
  },
  // Portrait filter
  { 
    id: 'portrait', 
    name: 'Portrait', 
    value: 'brightness(110%) contrast(130%) saturate(120%) hue-rotate(5deg) blur(0.2px)' 
  }
];

// 实际显示的滤镜列表（添加了随机滤镜）
const FILTERS = [
  { id: 'random', name: 'Random', value: 'random', isSpecial: true },
  ...BASE_FILTERS
];

// 获取滤镜列表
const getAllFilters = () => FILTERS;

// 根据ID获取滤镜
const getFilterById = (filterId) => {
  return FILTERS.find(filter => filter.id === filterId) || 
         { id: 'none', name: 'No Filter', value: 'none' };
};

// 随机选择滤镜（不包括 none 和 random）
const getRandomFilter = () => {
  // 过滤掉 none 滤镜和 random 滤镜
  const filterPool = BASE_FILTERS.filter(filter => filter.id !== 'none');
  const randomIndex = Math.floor(Math.random() * filterPool.length);
  return filterPool[randomIndex];
};

// 滤镜选择器组件
const FilterSelector = ({ activeFilter, onFilterChange, theme }) => {
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [diceValue, setDiceValue] = useState('⚀');
  
  // 骰子动画效果
  const rollDice = () => {
    // 骰子面
    const diceValues = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    setIsRollingDice(true);
    
    let rollCount = 0;
    const maxRolls = 10; // 滚动次数
    
    const rollInterval = setInterval(() => {
      // 随机选择一个骰子面
      const randomIndex = Math.floor(Math.random() * diceValues.length);
      setDiceValue(diceValues[randomIndex]);
      
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRollingDice(false);
        
        // 选择一个随机滤镜
        const randomFilter = getRandomFilter();
        onFilterChange(randomFilter.value);
      }
    }, 100); // 每100毫秒切换一次骰子
  };

  // 处理滤镜改变
  const handleFilterChange = (filterValue, filterOption) => {
    // 如果选择了随机滤镜
    if (filterOption && filterOption.id === 'random') {
      rollDice();
    } else {
      // 应用选定的滤镜
      onFilterChange(filterValue);
    }
  };

  return (
    <div className="filter-selector">
      <style>
        {`
          @media (max-width: 768px) {
            .filter-button {
              flex-basis: calc(50% - 20px); /* Adjust based on gap and desired spacing */
              margin: 4px !important; /* Reduce margin for tighter fit */
              padding: 8px 5px !important; /* Adjust padding if needed */
              font-size: 13px !important; /* Slightly smaller font for mobile */
              text-align: center;
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .spinning-dice {
            display: inline-block;
            animation: spin 0.5s linear infinite;
          }
        `}
      </style>
      <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>Photo Filters</h3>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '8px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {FILTERS.map((filterOption) => (
          <button
            key={filterOption.id}
            className="filter-button"
            onClick={() => handleFilterChange(filterOption.value, filterOption)}
            style={{
              backgroundColor: activeFilter === filterOption.value ? theme.mainPink : '#f0f0f0',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              border: activeFilter === filterOption.value ? `2px solid ${theme.accentColor}` : '1px solid #ccc',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              boxShadow: activeFilter === filterOption.value ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              flexGrow: 1,
              flexShrink: 1,
              position: 'relative'
            }}
          >
            {filterOption.id === 'random' ? (
              <>
                {isRollingDice ? (
                  <span className="spinning-dice" style={{ fontSize: '18px' }}>
                    {diceValue}
                  </span>
                ) : (
                  <span style={{ fontSize: '18px' }}>🎲</span>
                )}
                <span style={{ marginLeft: '5px' }}>
                  {filterOption.name}
                </span>
              </>
            ) : (
              filterOption.name
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export { FilterSelector, FILTERS, getAllFilters, getFilterById };