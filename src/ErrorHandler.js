import PubSub from 'pubsub-js';

export default class ErrorHandler {
    publishErrors = (responseError) => {
        responseError.errors.forEach(err => {
            PubSub.publish('validation-error', err);
        });
    }
}