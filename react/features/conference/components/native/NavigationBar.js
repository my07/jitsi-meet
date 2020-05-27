// @flow

import React, { Component } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { getConferenceName } from '../../../base/conference';
import { getFeatureFlag, MEETING_NAME_ENABLED } from '../../../base/flags';
import { connect } from '../../../base/redux';
import { PictureInPictureButton } from '../../../mobile/picture-in-picture';
import { isToolboxVisible } from '../../../toolbox';
import RaiseHandButton
    from '../../../toolbox/components/native/RaiseHandButton';
import ToggleCameraButton
    from '../../../toolbox/components/native/ToggleCameraButton';
import { TileViewButton } from '../../../video-layout/components';
import ConferenceTimer from '../ConferenceTimer';

import styles, { NAVBAR_GRADIENT_COLORS } from './styles';
import InviteButton
    from "../../../invite/components/add-people-dialog/native/InviteButton";

type Props = {

    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string,

    /**
     * Whether displaying the current meeting name is enabled or not.
     */
    _meetingNameEnabled: boolean,

    /**
     * True if the navigation bar should be visible.
     */
    _visible: boolean
};

/**
 * Implements a navigation bar component that is rendered on top of the
 * conference screen.
 */
class NavigationBar extends Component<Props> {
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render() {
        if (!this.props._visible) {
            return null;
        }
        const buttonProps = {
            afterClick: this._onCancel,
            showLabel: false,
            styles: styles.navBarButtonSmall
        };

        return [
            <LinearGradient
                colors = { NAVBAR_GRADIENT_COLORS }
                key = { 1 }
                pointerEvents = 'none'
                style = { styles.gradient }>
                <SafeAreaView>
                    <View style = { styles.gradientStretchTop } />
                </SafeAreaView>
            </LinearGradient>,
            <View
                key = { 2 }
                pointerEvents = 'box-none'
                style = { styles.navBarWrapper }>
                <PictureInPictureButton
                    styles = { styles.navBarButton } />
                <View
                    pointerEvents = 'box-none'
                    style = { styles.roomNameWrapper }>
                    {
                        this.props._meetingNameEnabled
                        && <Text
                            numberOfLines = { 1 }
                            style = { styles.roomName }>
                            { this.props._meetingName }
                        </Text>
                    }
                    <ConferenceTimer />
                </View>
                <View
                    accessibilityRole = 'toolbar'
                    style = { styles.toolbar }>
                    <InviteButton { ...buttonProps } />
                    <RaiseHandButton { ...buttonProps } />
                    <TileViewButton { ...buttonProps } />
                    <ToggleCameraButton { ...buttonProps } />
                </View>
            </View>
        ];
    }

}

/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        _meetingName: getConferenceName(state),
        _meetingNameEnabled: getFeatureFlag(state, MEETING_NAME_ENABLED, true),
        _visible: isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(NavigationBar);
