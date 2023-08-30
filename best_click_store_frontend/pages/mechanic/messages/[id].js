import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";
import Link from "next/link";

const MechanicLayout = dynamic(() => import('../layouts/mechaniclayout'), {
    ssr: false,
})

const Title = dynamic(() => import('../layouts/title'), {
    ssr: false,
})

export default function ID() {
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const { id } = router.query;
    useEffect(() => {
        if (id) {
            fetchData();
        }


    }, [id]);

    async function fetchData() {

        const res = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `customer/${id}`);
        console.log("RES", res.data);
        setProfile(res.data);
    }


    return (
        <>
            <Title page='Add Service'></Title>
            <MechanicLayout>
                {profile !== null && (

                    <div>
                        {profile.map(customer => (
                            <div>
                            <h1 align='center' className="text-4xl mt-4">Profile</h1>
                            
                            <div className="detaills w-6/12 float-left justify-center align-items-center flex flex-row  mt-10">
                                
                                <div className="w-2/12 float-left">
                                    <p>Name:</p><br />
                                    <p>Email:</p><br />
                                    <p>Phone:</p><br />
                                    <p>Gender: </p><br />
                                    <p>Address:</p><br />
                                </div>
                                <div className="profile w-4/12 float-left">
                                    <p>{customer.name}</p><br />
                                    <p>{customer.email}</p><br />
                                    <p>{customer.phone}</p><br />
                                    <p>{customer.gender}</p><br />
                                    <p>{customer.address}</p><br />
                                </div>
                                
    
                            </div>
                            <div className=" mt-10">
                                <img src={process.env.NEXT_PUBLIC_BACKEND_URL + 'customerprofilepic/' + customer.profilepic} width={200} height={200}></img>
                            </div>

                        </div>
                        )

                        )}
                    </div>
                )}
            </MechanicLayout>
        </>

    );
};




