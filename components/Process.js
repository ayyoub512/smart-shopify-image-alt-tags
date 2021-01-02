import React from 'react';
import { Page, TextStyle } from '@shopify/polaris';

import axios from 'axios';

import LoadingComponent from './LoadingComponent';

class ProcessURL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            url: props.url,
        };
    }

    componentDidMount() {
        axios
            .post('/api/shopify/process', {
                resultURL: this.state.url,
            })
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                    });

                    console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (err) => {
                    console.log(err);
                    this.setState({
                        isLoaded: true,
                        error: err,
                    });
                }
            );
    }

    render() {
        const { error, isLoaded } = this.state;
        if (error) {
            return (
                <Page>
                    <TextStyle variation='negative'>
                        Error occured, please refrech the page <br />
                        {error.message}
                    </TextStyle>
                </Page>
            );
        } else if (!isLoaded) {
            return <LoadingComponent processing={true} />;
        } else {
            return (
                <Page>
                    <LoadingComponent processing={true} />
                </Page>
            );
        }
    }
}

export default ProcessURL;
