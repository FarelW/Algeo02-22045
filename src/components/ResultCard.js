const ResultCard = (props) => {
    return (
      <div className="border-white w-[190px] border-2 flex flex-col">
        <div className="border-white w-full order-2 h-[120px] border-b-2"> 
        <img src={props.imageResult} className="w-full h-full object-cover object-center" alt="result"></img>
        </div>
        <div className="border-white bg-black bg-opacity-60 w-full order-2 h-[30px] flex justify-center items-center font-aenoniklight text-[12px]">Similarity : {props.similarity}%</div>
      </div>
    );
}

export default ResultCard;