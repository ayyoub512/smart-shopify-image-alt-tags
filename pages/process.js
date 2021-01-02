import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { Page } from '@shopify/polaris';
import { Context } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

import { BULK_STATUS_QUERY, BULK_INIT_MUTATION } from '../helpers/muations';
import LoadingComponent from '../components/LoadingComponent';
import ProcessURL from '../components/Process';

/**
 * some space
 * Here
 */

const Process = () => {
    const [createBulkRequest, { data: mutateData }] = useMutation(BULK_INIT_MUTATION);
    const { data, startPolling, stopPolling } = useQuery(BULK_STATUS_QUERY);

    const app = useContext(Context);
    const status = data && data.status;

    React.useEffect(() => {
        console.log('inside effect, data is ', data);
        if (status !== 'COMPLETED') {
            createBulkRequest();
            startPolling(1000);
        }
        return () => stopPolling();
    }, [status]);

    /**
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
     * checking if the object has properties: data.currentBulkOperation.url
     * object.hasOwnProperty('p2') && object.p2.hasOwnProperty('bulk') && object.p2.bulk.hasOwnProperty('url');
     */
    if (
        typeof data !== 'undefined' &&
        data.hasOwnProperty('currentBulkOperation') &&
        data.currentBulkOperation.hasOwnProperty('url') &&
        typeof data.currentBulkOperation.url !== 'undefined'
    ) {
        const url = data.currentBulkOperation.url;
        console.log('I am here, the data is', data, ' -- and the url is ', url);

        if (typeof url !== 'undefined') {
            console.log('Stopping the ');
            stopPolling();

            return <ProcessURL url={url} />;
        }
    }

    return (
        <Page>
            <LoadingComponent />
        </Page>
    );
};

export default Process;
