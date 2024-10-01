import { Link, Route, Routes } from "react-router-dom";
import ConfirmationChatChannelSubpage from "./chat/confirmation-chat-channel-subpage";
import ConfirmationChatAdminSubpage from "./chat/confirmation-chat-admin-subpage";
import { User } from "../../structs/user";

export default function ConfirmationChatSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (p: string | User) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <div className="minister-chat">
            <div className="tabs sub-tab">
                <ul>
                    <li>
                        <Link to={`channel`}>Kanał</Link>
                    </li>
                    <li>
                        <Link to={`admin`}>Ksiądz</Link>
                    </li>
                    <div className="clear"></div>
                </ul>
            </div>
            <Routes>
                <Route path="channel" element={<MinisterChatChannelSubpage getParams={getParams} />} />
                <Route path="admin" element={<MinisterChatAdminSubpage getParams={getParams} />} />
            </Routes>
        </div>
    );
}