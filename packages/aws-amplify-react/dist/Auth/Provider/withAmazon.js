'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AmazonButton = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = withAmazon;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _awsAmplify = require('aws-amplify');

var _AmplifyTheme = require('../../AmplifyTheme');

var _AmplifyTheme2 = _interopRequireDefault(_AmplifyTheme);

var _AmplifyUI = require('../../AmplifyUI');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _awsAmplify.Logger('withAmazon');

function withAmazon(Comp) {
    return function (_Component) {
        (0, _inherits3.default)(_class, _Component);

        function _class(props) {
            (0, _classCallCheck3.default)(this, _class);

            var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.initAmazon = _this.initAmazon.bind(_this);
            _this.signIn = _this.signIn.bind(_this);
            _this.federatedSignIn = _this.federatedSignIn.bind(_this);

            _this.state = {};
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: 'signIn',
            value: function signIn() {
                var _this2 = this;

                var amz = window.amazon;
                var options = { scope: 'profile' };
                amz.Login.authorize(options, function (response) {
                    if (response.error) {
                        logger.debug('Failed to login with amazon: ' + response.error);
                        return;
                    }

                    _this2.federatedSignIn(response);
                });
            }
        }, {
            key: 'federatedSignIn',
            value: function federatedSignIn(response) {
                var access_token = response.access_token,
                    expires_in = response.expires_in;
                var onStateChange = this.props.onStateChange;

                var date = new Date();
                var expires_at = expires_in * 1000 + date.getTime();
                if (!access_token) {
                    return;
                }

                var amz = window.amazon;
                amz.Login.retrieveProfile(function (userInfo) {
                    if (!userInfo.success) {
                        logger.debug('Get user Info failed');
                        return;
                    }

                    var user = {
                        name: userInfo.profile.Name
                    };

                    _awsAmplify.Auth.federatedSignIn('amazon', { token: access_token, expires_at: expires_at }, user).then(function (credentials) {
                        return _awsAmplify.Auth.currentAuthenticatedUser();
                    }).then(function (authUser) {
                        if (onStateChange) {
                            onStateChange('signedIn', authUser);
                        }
                    });
                });
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var amazon_client_id = this.props.amazon_client_id;

                if (amazon_client_id) this.createScript();
            }
        }, {
            key: 'createScript',
            value: function createScript() {
                var script = document.createElement('script');
                script.src = 'https://api-cdn.amazon.com/sdk/login1.js';
                script.async = true;
                script.onload = this.initAmazon;
                document.body.appendChild(script);
            }
        }, {
            key: 'initAmazon',
            value: function initAmazon() {
                logger.debug('init amazon');
                var amazon_client_id = this.props.amazon_client_id;

                var amz = window.amazon;
                amz.Login.setClientId(amazon_client_id);
            }
        }, {
            key: 'render',
            value: function render() {
                var amz = window.amazon;
                return _react2.default.createElement(Comp, (0, _extends3.default)({}, this.props, { amz: amz, amazonSignIn: this.signIn }));
            }
        }]);
        return _class;
    }(_react.Component);
}

var Button = function Button(props) {
    return _react2.default.createElement(
        _AmplifyUI.SignInButton,
        {
            id: 'amazon_signin_btn',
            onClick: props.amazonSignIn,
            theme: props.theme || _AmplifyTheme2.default
        },
        'Sign In with Amazon'
    );
};

var AmazonButton = exports.AmazonButton = withAmazon(Button);