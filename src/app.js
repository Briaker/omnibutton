import React from 'react';
import ReactDOM from 'react-dom';
import OmniButton from './components/omnibutton'

class App extends React.Component {
    render() {
        return (
            <div>
                <OmniButton />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));