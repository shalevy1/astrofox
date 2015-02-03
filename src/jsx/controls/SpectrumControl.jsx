var SpectrumControl = React.createClass({
    name: 'spectrum',
    context: '2d',

    getInitialState: function() {
        return {
            height: 300,
            width: 774,
            x: 40,
            y: 340,
            barWidth: -1,
            barSpacing: -1,
            barWidthAutoSize: 1,
            barSpacingAutoSize: 1,
            smoothingTimeConstant: 0.5,
            maxDecibels: -12,
            maxFrequency: 3000,
            shadowHeight: 100,
            color: ['#ffffff', '#ffffff'],
            shadowColor: ['#cccccc', '#cccccc'],
            rotation: 0,
            opacity: 1.0
        };
    },

    componentWillMount: function() {
        var app = this.props.app,
            FX = app.FX;

        this.canvas = document.createElement('canvas');
        this.analyzer = app.createAnalyzer(this.state);
        this.bars = new FX.BarDisplay(this.canvas, this.state);
    },

    componentDidMount: function() {
        console.log('control mounted', this.name);

        this.props.onLoad(this)
    },

    handleChange: function(name, val) {
        var state = {};

        if (name === 'barWidthAutoSize') {
            state.barWidth = (val) ? -1 : 1;
        }
        else if (name === 'barSpacingAutoSize') {
            state.barSpacing = (val) ? -1 : 1;
        }

        state[name] = val;

        this.setState(state, function() {
            this.bars.configure(this.state);
            this.analyzer.configure(this.state);
        }.bind(this));
    },

    renderToCanvas: function(canvas, frame, fft) {
        var data,
            context = canvas.getContext('2d'),
            canvas = this.canvas,
            state = this.state,
            width = state.width / 2,
            height = state.height;

        if (typeof fft !== 'undefined') {
            data = this.analyzer.parseFrequencyData(fft);
        }
        else {
            data = this.analyzer.getFrequencyData();
        }

        this.bars.render(data);

        if (state.rotation % 360 !== 0) {
            context.save();
            context.translate(state.x, state.y - state.height);
            context.translate(width, height);
            context.rotate(state.rotation * Math.PI / 180);
            context.drawImage(canvas, -width, -height);
            context.restore();
        }
        else {
            context.drawImage(canvas, state.x, state.y - state.height);
        }
    },

    render: function() {
        var maxFrequency = this.analyzer.getMaxFrequency() / 2;
        var maxHeight = 480;
        var maxWidth = 854;

        return (
            <div className="control">
                <div className="header">
                    <span>SPECTRUM</span>
                </div>
                <div className="row">
                    <label>Max dB</label>
                    <NumberInput
                        name="maxDecibels"
                        size="3"
                        value={this.state.maxDecibels}
                        min={-40}
                        max={0}
                        step={1}
                        onChange={this.handleChange} />
                    <div className="input flex">
                        <RangeInput
                            name="maxDecibels"
                            min={-40}
                            max={0}
                            step={1}
                            value={this.state.maxDecibels}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Max Frequency</label>
                    <NumberInput
                        name="maxFrequency"
                        size="4"
                        value={this.state.maxFrequency}
                        min={0}
                        max={maxFrequency}
                        step={20}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="maxFrequency"
                            min={100}
                            max={maxFrequency}
                            step={20}
                            value={this.state.maxFrequency}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Smoothing</label>
                    <NumberInput
                        name="smoothingTimeConstant"
                        size="3"
                        value={this.state.smoothingTimeConstant}
                        min={0}
                        max={0.99}
                        step={0.01}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="smoothingTimeConstant"
                            min={0}
                            max={0.99}
                            step={0.01}
                            value={this.state.smoothingTimeConstant}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Width</label>
                    <NumberInput
                        name="width"
                        size="3"
                        value={this.state.width}
                        min={0}
                        max={maxWidth}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="width"
                            min={0}
                            max={maxWidth}
                            value={this.state.width}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Height</label>
                    <NumberInput
                        name="height"
                        size="3"
                        min={0}
                        max={maxWidth}
                        value={this.state.height}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="height"
                            min={0}
                            max={maxWidth}
                            value={this.state.height}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Shadow Height</label>
                    <NumberInput
                        name="shadowHeight"
                        size="3"
                        min={0}
                        max={maxWidth}
                        value={this.state.shadowHeight}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="shadowHeight"
                            min={0}
                            max={maxWidth}
                            value={this.state.shadowHeight}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Bar Width</label>
                    <NumberInput
                        name="barWidth"
                        size="3"
                        min={-1}
                        max={maxWidth}
                        value={this.state.barWidth}
                        readOnly={this.state.barWidthAutoSize}
                        hidden={this.state.barWidthAutoSize}
                        onChange={this.handleChange}
                    />
                    <label>Auto-Size</label>
                    <ToggleInput
                        name="barWidthAutoSize"
                        value={this.state.barWidthAutoSize}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="row">
                    <label>Bar Spacing</label>
                    <NumberInput
                        name="barSpacing"
                        size="3"
                        min={-1}
                        max={maxWidth}
                        value={this.state.barSpacing}
                        readOnly={this.state.barSpacingAutoSize}
                        hidden={this.state.barSpacingAutoSize}
                        onChange={this.handleChange} />
                    <label>Auto-Size</label>
                    <ToggleInput
                        name="barSpacingAutoSize"
                        value={this.state.barSpacingAutoSize}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="row">
                    <label>Bar Color</label>
                    <ColorRangeInput
                        name="color"
                        value={this.state.color}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="row">
                    <label>Shadow Color</label>
                    <ColorRangeInput
                        name="shadowColor"
                        value={this.state.shadowColor}
                        onChange={this.handleChange}
                    />
                </div>
                <div className="row">
                    <label>X</label>
                    <NumberInput
                        name="x"
                        size="3"
                        value={this.state.x}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="x"
                            min={-maxWidth}
                            max={maxWidth}
                            value={this.state.x}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Y</label>
                    <NumberInput
                        name="y"
                        size="3"
                        value={this.state.y}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="y"
                            min={-maxHeight}
                            max={maxHeight*2}
                            value={this.state.y}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Rotation</label>
                    <NumberInput
                        name="rotation"
                        size="3"
                        min={0}
                        max={360}
                        value={this.state.rotation}
                        onChange={this.handleChange}
                    />
                    <div className="input flex">
                        <RangeInput
                            name="rotation"
                            min={0}
                            max={360}
                            value={this.state.rotation}
                            onChange={this.handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    <label>Opacity</label>
                    <NumberInput
                        name="opacity"
                        size="3"
                        min={0}
                        max={1.0}
                        step={0.1}
                        value={this.state.opacity}
                        onChange={this.handleChange} />
                    <div className="input flex">
                        <RangeInput
                            name="opacity"
                            min={0}
                            max={1.0}
                            step={0.1}
                            value={this.state.opacity}
                            onChange={this.handleChange} />
                    </div>
                </div>
            </div>
        );
    }
});