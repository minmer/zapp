export default function LoadingComponent() {
    return (
        <div className="loadingwavecontainer">
            <div className="loadingwave">
                {[...Array(15)].map((_, index) => (
                    <div key={index} className="wave" style={{ animationDelay: `${index * 0.1}s` }}></div>
                ))}
            </div>
        </div>
    );
}
