import { Outlet } from "react-router-dom";

export default function LoginPage() {
    return (

        <>
            <div style={{
                width: "0px"
            }}>
                <input
                    type="text"
                    placeholder="User"
                />
                <input
                    type="password"
                    placeholder="Password"
                />
                <button>Log In</button>
            </div>
            <Outlet/>
        </>
    );
}