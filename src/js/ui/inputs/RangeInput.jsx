'use strict';

const React = require('react');

const autoBind = require('../../util/autoBind.js');
const { clamp, val2pct, hash } = require('../../util/math.js');

class RangeInput extends React.Component {
    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            value: props.value,
            buffering: false
        };
    }

    componentWillReceiveProps(props) {
        if (props.value !== undefined) {
            this.setValue(props.value, Object.assign({}, this.props, props));
        }
    }

    onChange(e) {
        let props = this.props;

        let val = this.setValue(Number(e.currentTarget.value), props);

        if (props.buffered && this.state.buffering) {
            props.onInput(props.name, val);
        }
        else {
            props.onChange(props.name, val);
        }
    }

    onMouseDown(e) {
        if (this.props.buffered) {
            this.setState({ buffering: true });
        }
    }

    onMouseUp(e) {
        if (this.props.buffered) {
            this.setState({ buffering: false });

            this.onChange(e);
        }
    }

    setValue(val, props) {
        if (props.lowerLimit !== false && val < props.lowerLimit) {
            val = props.lowerLimit;
        }
        else if (props.upperLimit !== false && val > props.upperLimit) {
            val = props.upperLimit;
        }

        this.setState({ value: val });

        return val;
    }

    isBuffering() {
        return this.state.buffering;
    }

    render() {
        let props = this.props,
            fillStyle = { width: (val2pct(this.state.value, props.min, props.max) * 100) + '%' };

        return (
            <div className="input-range">
                <div className="track"/>
                <div className="fill" style={fillStyle}/>
                <input
                    key={hash(props.name + props.min + props.max + props.step)}
                    className="range"
                    type="range"
                    name={props.name}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                    value={clamp(this.state.value, props.min, props.max)}
                    onChange={this.onChange}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    readOnly={props.readOnly}
                />
            </div>
        );
    }
}

RangeInput.defaultProps = {
    name: "range",
    min: 0,
    max: 1,
    value: 0,
    step: 1,
    lowerLimit: false,
    upperLimit: false,
    buffered: false,
    readOnly: false,
    onChange: () => {},
    onInput: () => {}
};

module.exports = RangeInput;