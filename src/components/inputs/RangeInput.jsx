import React from 'react';
import classNames from 'classnames';

import { val2pct } from 'utils/math';

export default class RangeInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        };

        this.buffering = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== undefined) {
            this.setValue(nextProps.value, Object.assign({}, this.props, nextProps));
        }
    }

    onChange = (e) => {
        let props = this.props;

        let val = this.setValue(e.currentTarget.value, props);

        if (props.buffered && this.buffering && props.onInput) {
            props.onInput(props.name, val);
        }
        else if (props.onChange) {
            props.onChange(props.name, val);
        }
    };

    onMouseDown = () => {
        if (this.props.buffered) {
            this.buffering = true;
        }
    };

    onMouseUp = (e) => {
        if (this.props.buffered) {
            this.buffering = false;
            this.onChange(e);
        }
    };

    setValue(val, props) {
        val = this.parseValue(val, props);

        this.setState({ value: val });

        return val;
    }

    parseValue(val, props) {
        let { lowerLimit, upperLimit } = props;

        if (lowerLimit !== false && val < lowerLimit) {
            val = lowerLimit;
        }
        else if (upperLimit !== false && val > upperLimit) {
            val = upperLimit;
        }

        return Number(val);
    }

    isBuffering() {
        return this.buffering;
    }

    getFillStyle() {
        let val = this.state.value,
            { min, max, fillStyle } = this.props,
            pct = val2pct(val, min, max) * 100;

        switch (fillStyle) {
            case 'left':
                return {width: pct + '%'};
            case 'right':
                return {width: (100 - pct) + '%', marginLeft: pct + '%'};
            default:
                return {display: 'none'};
        }
    }

    render() {
        let val = this.state.value,
            { name, min, max, step, readOnly, showTrack } = this.props;

        return (
            <div className="input-range">
                <div className={classNames({ 'track': true, 'display-none': !showTrack })} />
                <div className="fill" style={this.getFillStyle()} />
                <input
                    className="range"
                    type="range"
                    name={name}
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={this.onChange}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    readOnly={readOnly}
                />
            </div>
        );
    }
}

RangeInput.defaultProps = {
    name: 'range',
    min: 0,
    max: 1,
    value: 0,
    step: 1,
    lowerLimit: false,
    upperLimit: false,
    buffered: false,
    readOnly: false,
    fillStyle: 'left',
    showTrack: true,
    onChange: null,
    onInput: null
};