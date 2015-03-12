var LayersPanel = React.createClass({
    getInitialState: function() {
        return {
            activeIndex: 0
        };
    },

    handleLayerClick: function(index) {
        if (this.state.activeIndex !== index) {
            this.setState({ activeIndex: index });
        }
    },

    render: function() {
        var layers = this.props.app.displays.map(function(display, index) {
            var classes = 'layer';
            if (index == this.state.activeIndex) {
                classes += ' layer-active';
            }

            return (
                <div key={'layer' + display.toString()}
                    className={classes}
                    onClick={this.handleLayerClick.bind(this, index)}>
                    {display.toString()}
                </div>
            );
        }, this);

        return (
            <div id="layers">
                <div className="layers">
                    {layers}
                </div>
                <ul className="commands">
                    <li className="button icon-plus" />
                    <li className="button icon-minus" />
                </ul>
            </div>
        );
    }
});