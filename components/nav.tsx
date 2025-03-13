'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface NavProps {
    value: number;
    onChange: (value: number) => void;
}

export default function Nav({value, onChange}: NavProps) {
    const user = {
        name: 'Johnny',
        avatar: 'https://avatars.githubusercontent.com/u/52646391?v=4',
    };
    
    const [userMenu, setUserMenu] = useState(false);

    const handleOnClick = (value: number) => {
        onChange(value);
    };

    return (
        <>
            {/* top navigation */}
            <nav className="bg-black text-gray-100">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center">
                        <Image className="h-12 mr-3" src="/images/movies-logo.png" width={200} height={135} alt="Movies Logo" />
                    </Link>

                    <div className="flex md:order-2">
                        <button type="button" className="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>

                        <button type="button" className="mr-4">
                            <svg className="bi bi-bell" xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/></svg>
                        </button>

                        <button type="button" onClick={() => setUserMenu(!userMenu)} className="flex mr-3 text-sm md:mr-0">
                            <span className="sr-only">Open user menu</span>
                            <Image className="w-9 h-9" src={user.avatar} width={36} height={36} alt={user.name} />
                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>

                        <div id="user-dropdown" className="z-50 absolute my-10 text-base list-none bg-gray-200 divide-y divide-gray-100 rounded-lg shadow" style={userMenu ? {visibility:'visible'} : {visibility:'hidden'}}>
                            <div className="w-40">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-gray-900">{user.name}</span>
                                    <span className="block text-sm  text-gray-500 truncate">signed in</span>
                                </div>
                                <ul className="py-2">
                                    <li>
                                        <Link href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                                    </li>
                                    <li>
                                        <Link href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <button type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open mobile menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>

                    <div id="mobile-menu" className="items-center justify-between w-full md:flex md:w-auto md:order-1">
                        <ul className="flex font-medium flex-row space-x-2 p-0 mt-0">
                            <li>
                                <Link href="/" className="block py-2 pl-3 pr-4 hover:text-red-700">Home</Link>
                            </li>
                            <li>
                                <Link href="#movies" className="block py-2 pl-3 pr-4 hover:text-red-700" onClick={() => handleOnClick(0)}>Movies</Link>
                            </li>
                            <li>
                                <Link href="#upcoming" className="block py-2 pl-3 pr-4 hover:text-red-700" onClick={() => handleOnClick(1)}>Upcoming</Link>
                            </li>
                            <li>
                                <Link href="#popular" className="block py-2 pl-3 pr-4 hover:text-red-700" onClick={() => handleOnClick(2)}>Popular</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
};