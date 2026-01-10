import React from 'react';
import { SimpleInfoScreen } from './_components';

export default function ChangePasswordScreen() {
    return (
        <SimpleInfoScreen
            title="Change Password"
            subtitle="Secure your account"
            body="Password changes will be available here. Until then, please use the reset link from the login screen to change your password."
        />
    );
}
