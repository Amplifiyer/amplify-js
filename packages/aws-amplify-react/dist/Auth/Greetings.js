'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _awsAmplify = require('aws-amplify');

var _AuthPiece2 = require('./AuthPiece');

var _AuthPiece3 = _interopRequireDefault(_AuthPiece2);

var _AmplifyUI = require('../AmplifyUI');

var _AmplifyTheme = require('../AmplifyTheme');

var _AmplifyTheme2 = _interopRequireDefault(_AmplifyTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = new _awsAmplify.Logger('Greetings'); /*
                                                   * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
                                                   *
                                                   * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
                                                   * the License. A copy of the License is located at
                                                   *
                                                   *     http://aws.amazon.com/apache2.0/
                                                   *
                                                   * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
                                                   * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
                                                   * and limitations under the License.
                                                   */

var Greetings = function (_AuthPiece) {
    (0, _inherits3.default)(Greetings, _AuthPiece);

    function Greetings(props) {
        (0, _classCallCheck3.default)(this, Greetings);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Greetings.__proto__ || Object.getPrototypeOf(Greetings)).call(this, props));

        _this.signOut = _this.signOut.bind(_this);
        _this.googleSignOut = _this.googleSignOut.bind(_this);
        _this.facebookSignOut = _this.facebookSignOut.bind(_this);
        _this.checkUser = _this.checkUser.bind(_this);
        _this.onHubCapsule = _this.onHubCapsule.bind(_this);

        _this.state = {
            authState: props.authState,
            authData: props.authData
        };

        _awsAmplify.Hub.listen('auth', _this);
        return _this;
    }

    (0, _createClass3.default)(Greetings, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._isMounted = true;
            this.checkUser();
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._isMounted = false;
        }
    }, {
        key: 'signOut',
        value: function signOut() {
            var _this2 = this;

            this.googleSignOut();
            this.facebookSignOut();
            _awsAmplify.Auth.signOut().then(function () {
                return _this2.changeState('signedOut');
            }).catch(function (err) {
                logger.error(err);_this2.error(err);
            });
        }
    }, {
        key: 'googleSignOut',
        value: function googleSignOut() {
            var authInstance = window.gapi && window.gapi.auth2 ? window.gapi.auth2.getAuthInstance() : null;
            if (!authInstance) {
                return Promise.resolve(null);
            }

            authInstance.then(function (googleAuth) {
                if (!googleAuth) {
                    logger.debug('google Auth undefined');
                    return Promise.resolve(null);
                }

                logger.debug('google signing out');
                return googleAuth.signOut();
            });
        }
    }, {
        key: 'facebookSignOut',
        value: function facebookSignOut() {
            var fb = window.FB;
            if (!fb) {
                logger.debug('FB sdk undefined');
                return Promise.resolve(null);
            }

            fb.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    return new Promise(function (res, rej) {
                        logger.debug('facebook signing out');
                        fb.logout(function (response) {
                            res(response);
                        });
                    });
                } else {
                    return Promise.resolve(null);
                }
            });
        }
    }, {
        key: 'checkUser',
        value: function checkUser() {
            var _this3 = this;

            var that = this;
            var authState = this.state.authState;

            return _awsAmplify.Auth.currentAuthenticatedUser().then(function (user) {
                if (!that._isMounted) {
                    return;
                }
                if (authState !== 'signedIn') {
                    _this3.setState({
                        authState: 'signedIn',
                        authData: user
                    });
                    _this3.changeState('signedIn', user);
                }
            }).catch(function (err) {
                if (!that._isMounted) {
                    return;
                }
                if (!authState || authState === 'signedIn') {
                    _this3.setState({ authState: 'signIn' });
                    _this3.changeState('signIn');
                }
            });
        }
    }, {
        key: 'onHubCapsule',
        value: function onHubCapsule(capsule) {
            var channel = capsule.channel,
                payload = capsule.payload,
                source = capsule.source;

            if (channel === 'auth' && (payload.event === 'configured' || payload.event === 'cognitoHostedUI')) {
                this.checkUser();
            }
        }
    }, {
        key: 'inGreeting',
        value: function inGreeting(name) {
            return 'Hello ' + name;
        }
    }, {
        key: 'outGreeting',
        value: function outGreeting() {
            return '';
        }
    }, {
        key: 'userGreetings',
        value: function userGreetings(theme) {
            var user = this.state.authData;
            var greeting = this.props.inGreeting || this.inGreeting;
            // get name from attributes first
            var nameFromAttr = user.attributes ? user.attributes.name || (user.attributes.given_name ? user.attributes.given_name + ' ' + user.attributes.family_name : undefined) : undefined;

            var name = nameFromAttr || user.name || user.username;
            var message = typeof greeting === 'function' ? greeting(name) : greeting;
            return _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement(
                    _AmplifyUI.NavItem,
                    { theme: theme },
                    message
                ),
                _react2.default.createElement(
                    _AmplifyUI.NavButton,
                    {
                        theme: theme,
                        onClick: this.signOut
                    },
                    _awsAmplify.I18n.get('Sign Out')
                )
            );
        }
    }, {
        key: 'noUserGreetings',
        value: function noUserGreetings(theme) {
            var greeting = this.props.outGreeting || this.outGreeting;
            var message = typeof greeting === 'function' ? greeting() : greeting;
            return message ? _react2.default.createElement(
                _AmplifyUI.NavItem,
                { theme: theme },
                message
            ) : null;
        }
    }, {
        key: 'render',
        value: function render() {
            var hide = this.props.hide;

            if (hide && hide.includes(Greetings)) {
                return null;
            }

            var authState = this.state.authState;

            var signedIn = authState === 'signedIn';

            var theme = this.props.theme || _AmplifyTheme2.default;
            var greeting = signedIn ? this.userGreetings(theme) : this.noUserGreetings(theme);
            if (!greeting) {
                return null;
            }

            return _react2.default.createElement(
                _AmplifyUI.NavBar,
                { theme: theme },
                _react2.default.createElement(
                    _AmplifyUI.Nav,
                    { theme: theme },
                    _react2.default.createElement(
                        _AmplifyUI.NavRight,
                        { theme: theme },
                        greeting
                    )
                )
            );
        }
    }]);
    return Greetings;
}(_AuthPiece3.default);

exports.default = Greetings;