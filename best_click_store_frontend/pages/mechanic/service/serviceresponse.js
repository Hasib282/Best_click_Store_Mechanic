import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../authentication/sessionAuthentication';

const MechanicLayout = dynamic(() => import('../layouts/mechaniclayout'), {
    ssr: false,
})

const Title = dynamic(() => import('../layouts/title'), {
    ssr: false,
})

export default function ChangePassword() {
    




    return (
        <>
            <Title page='Response Request'></Title>
            <MechanicLayout>
                <h1 align='center' className="text-4xl pt-4">Response to request</h1>
                <div className="detaills w-full float-left justify-center align-items-center flex flex-row  mt-10">
                    <form onSubmit={''}>
                        <label htmlFor='oldpass'>Change Status</label><br /><br/>
                        <input type='text' name='oldpass' id='oldpass' onChange={''} className="input input-bordered w-full max-w-xs"></input>
                        
                        <br/><br/>
                        <p align="center"><button type="submit" className="btn bg-cyan-400 hover:bg-cyan-300">Update</button></p>
                    </form>
                </div>
            </MechanicLayout>
        </>
    )
}