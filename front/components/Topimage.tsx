const Topimage = () => {
  return (
    <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
      <div className="flex flex-wrap mx-auto">
        <h1 className="font-zen font-medium text-xl text-left md:text-2xl lg:mt-36 lg:text-2xl">
          離れている家族に
          <br />
          おかずのおすそ分け
        </h1>
        <img src="/images/main.png" className="w-[600px] h-auto" alt="画像" />
      </div>
    </div>
  );
};

export default Topimage;
