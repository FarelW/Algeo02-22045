const UploadCard = (props) => {
    return (
        <div className="px-2 py-1 w-fit border-white bg-gray-500 rounded-lg flex flex-row justify-center items-center">
            {props.filename}
        </div>
    )
}

export default UploadCard;