import FileStorageImage from "@/components/file-storage/image";

const loading = () => {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <FileStorageImage
                src={`images/vertical-logo.png`}
                width={500}
                height={500}
                alt="logo"
                unoptimized
                className="animate-pulse"
            />
        </div>
    );
};

export default loading;
