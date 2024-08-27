import UsersWidget from "../widgets/users-widget";

export default function RootPage({ getParams }: { getParams: ({ func, type, show }: { func: (t: unknown) => Promise<unknown>, type: string, show: boolean }) => Promise<unknown> }) {
    return (

        <>
            <div className="mosaic">
                <UsersWidget getParams={getParams} />
            </div>
        </>
    );
}