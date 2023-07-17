"use client";
import { AddressPanel, ProfileForm } from "@components/store/account/profile";
import React from "react";
function AccountProfile() {
    return (
        <div className="flex">
            <div className="w-2/3 p-4 bg-white rounded-lg">
                <ProfileForm />
            </div>
            <div className=" w-1/3 p-4 bg-white ml-4 rounded-lg h-fit">
                <AddressPanel />
            </div>
        </div>
    );
}

export default AccountProfile;
