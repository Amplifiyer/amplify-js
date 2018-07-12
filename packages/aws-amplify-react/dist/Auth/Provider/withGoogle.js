'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GoogleButton = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = withGoogle;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _awsAmplify = require('aws-amplify');

var _AmplifyTheme = require('../../AmplifyTheme');

var _AmplifyTheme2 = _interopRequireDefault(_AmplifyTheme);

var _AmplifyUI = require('../../AmplifyUI');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _awsAmplify.Logger('withGoogle');

function withGoogle(Comp) {
    return function (_Component) {
        (0, _inherits3.default)(_class, _Component);

        function _class(props) {
            (0, _classCallCheck3.default)(this, _class);

            var _this = (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

            _this.initGapi = _this.initGapi.bind(_this);
            _this.signIn = _this.signIn.bind(_this);
            _this.federatedSignIn = _this.federatedSignIn.bind(_this);

            _this.state = {};
            return _this;
        }

        (0, _createClass3.default)(_class, [{
            key: 'signIn',
            value: function signIn() {
                var _this2 = this;

                var ga = window.gapi.auth2.getAuthInstance();
                var onError = this.props.onError;

                ga.signIn().then(function (googleUser) {
                    return _this2.federatedSignIn(googleUser);
                }, function (error) {
                    if (onError) onError(error);else throw error;
                });
            }
        }, {
            key: 'federatedSignIn',
            value: function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(googleUser) {
                    var _googleUser$getAuthRe, id_token, expires_at, profile, user, onStateChange;

                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    _googleUser$getAuthRe = googleUser.getAuthResponse(), id_token = _googleUser$getAuthRe.id_token, expires_at = _googleUser$getAuthRe.expires_at;
                                    profile = googleUser.getBasicProfile();
                                    user = {
                                        email: profile.getEmail(),
                                        name: profile.getName()
                                    };
                                    onStateChange = this.props.onStateChange;
                                    _context.next = 6;
                                    return _awsAmplify.Auth.federatedSignIn('google', { token: id_token, expires_at: expires_at }, user);

                                case 6:
                                    _context.next = 8;
                                    return _awsAmplify.Auth.currentAuthenticatedUser();

                                case 8:
                                    user = _context.sent;


                                    if (onStateChange) {
                                        onStateChange('signedIn', user);
                                    }

                                case 10:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, this);
                }));

                function federatedSignIn(_x) {
                    return _ref.apply(this, arguments);
                }

                return federatedSignIn;
            }()
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var google_client_id = this.props.google_client_id;

                if (google_client_id) this.createScript();
            }
        }, {
            key: 'createScript',
            value: function createScript() {
                var script = document.createElement('script');
                script.src = 'https://apis.google.com/js/platform.js';
                script.async = true;
                script.onload = this.initGapi;
                document.body.appendChild(script);
            }
        }, {
            key: 'initGapi',
            value: function initGapi() {
                logger.debug('init gapi');

                var that = this;
                var google_client_id = this.props.google_client_id;

                var g = window.gapi;
                g.load('auth2', function () {
                    g.auth2.init({
                        client_id: google_client_id,
                        scope: 'profile email openid'
                    });
                });
            }
        }, {
            key: 'render',
            value: function render() {
                var ga = window.gapi && window.gapi.auth2 ? window.gapi.auth2.getAuthInstance() : null;
                return _react2.default.createElement(Comp, (0, _extends3.default)({}, this.props, { ga: ga, googleSignIn: this.signIn }));
            }
        }]);
        return _class;
    }(_react.Component);
}

var Button = function Button(props) {
    return _react2.default.createElement(
        _AmplifyUI.SignInButton,
        {
            id: 'google_signin_btn',
            onClick: props.googleSignIn,
            theme: props.theme || _AmplifyTheme2.default
        },
        'Sign In with Google'
    );
};

var GoogleButton = exports.GoogleButton = withGoogle(Button);