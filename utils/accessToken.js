let accessToken = '';

const setToken = (token) => {
    accessToken = token;
};

const getToken = () => {
    return accessToken;
};

exports.setToken = setToken;
exports.getToken = getToken;
