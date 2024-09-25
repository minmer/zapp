import { Link, Route, Routes } from "react-router-dom";
import MinisterChatGroupSubpage from "./chat/minister-chat-group-subpage";
import MinisterChatChannelSubpage from "./chat/minister-chat-channel-subpage";
import MinisterChatAdminSubpage from "./chat/minister-chat-admin-subpage";

export default function MinisterChatSubpage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (
        <div className="minister-chat">
            <div className="tabs sub-tab">
                <ul>
                    <li>
                        <Link to={`channel`}>Kanał</Link>
                    </li>
                    <li>
                        <Link to={`group`}>Grupowy chat</Link>
                    </li>
                    <li>
                        <Link to={`admin`}>Ksiądz</Link>
                    </li>
                    <div className="clear"></div>
                </ul>
            </div>
            <Routes>
                <Route path="channel" element={<MinisterChatChannelSubpage getParams={getParams} />} />
                <Route path="group" element={<MinisterChatGroupSubpage getParams={getParams} />} />
                <Route path="admin" element={<MinisterChatAdminSubpage getParams={getParams} />} />
            </Routes>
        </div>
    );
}