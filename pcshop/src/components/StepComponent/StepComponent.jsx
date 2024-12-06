import { Steps } from 'antd';
import React from 'react';

const StepComponent = ({ current = 0, items = [] }) => {
    const { Step } = Steps;
    return (
        <Steps size="small" current={current}>
            {items.map((item) => (
                <Step key={item.title} title={item.title} description={item.description} />
            ))}
        </Steps>
    );
};

export default StepComponent;