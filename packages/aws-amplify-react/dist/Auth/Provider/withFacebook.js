'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FacebookButton = undefined;

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

exports.default = withFacebook;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _awsAmplify = require('aws-amplify');

var _AmplifyTheme = require('../../AmplifyTheme');

var _AmplifyTheme2 = _interopRequireDefault(_AmplifyTheme);

var _AmplifyUI = require('../../AmplifyUI');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _awsAmplify.Logger('withFacebook');

function withFacebook(Comp) {
    return function (_Component) {
        (0, _inherits3.default)(_class, _Component);

        function _class(props) {
            (0, _classCallCheck3.default)(this, _class);

            var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.fbAsyncInit = _this.fbAsyncInit.bind(_this);
            _this.initFB = _this.initFB.bind(_this);
            _this.signIn = _this.signIn.bind(_this);
            _this.federatedSignIn = _this.federatedSignIn.bind(_this);

            _this.state = {};
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: 'signIn',
            value: function signIn() {
                var _this2 = this;

                var fb = window.FB;

                fb.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        _this2.federatedSignIn(response.authResponse);
                    } else {
                        fb.login(function (response) {
                            if (!response || !response.authResponse) {
                                return;
                            }
                            _this2.federatedSignIn(response.authResponse);
                        }, { scope: 'public_profile,email' });
                    }
                });
            }
        }, {
            key: 'federatedSignIn',
            value: function federatedSignIn(response) {
                logger.debug(response);
                var onStateChange = this.props.onStateChange;
                var accessToken = response.accessToken,
                    expiresIn = response.expiresIn;

                var date = new Date();
                var expires_at = expiresIn * 1000 + date.getTime();
                if (!accessToken) {
                    return;
                }

                var fb = window.FB;
                fb.api('/me', function (response) {
                    var user = {
                        name: response.name
                    };

                    _awsAmplify.Auth.federatedSignIn('facebook', { token: accessToken, expires_at: expires_at }, user).then(function (credentials) {
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
                var facebook_app_id = this.props.facebook_app_id;

                if (facebook_app_id) this.createScript();
            }
        }, {
            key: 'fbAsyncInit',
            value: function fbAsyncInit() {
                logger.debug('init FB');

                var facebook_app_id = this.props.facebook_app_id;

                var fb = window.FB;
                fb.init({
                    appId: facebook_app_id,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.11'
                });

                fb.getLoginStatus(function (response) {
                    return logger.debug(response);
                });
            }
        }, {
            key: 'initFB',
            value: function initFB() {
                var fb = window.FB;
                logger.debug('FB inited');
            }
        }, {
            key: 'createScript',
            value: function createScript() {
                window.fbAsyncInit = this.fbAsyncInit;

                var script = document.createElement('script');
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                script.async = true;
                script.onload = this.initFB;
                document.body.appendChild(script);
            }
        }, {
            key: 'render',
            value: function render() {
                var fb = window.FB;
                return _react2.default.createElement(Comp, (0, _extends3.default)({}, this.props, { fb: fb, facebookSignIn: this.signIn }));
            }
        }]);
        return _class;
    }(_react.Component);
}

var Button = function Button(props) {
    return _react2.default.createElement(
        _AmplifyUI.SignInButton,
        {
            id: 'facebook_signin_btn',
            onClick: props.facebookSignIn,
            theme: props.theme || _AmplifyTheme2.default
        },
        'Sign In with Facebook'
    );
};

var FacebookButton = exports.FacebookButton = withFacebook(Button);