import imgComing from '../../assets/imgs/coming.png';

export const Live = () => {
  return (
    <div className="flex flex-col justify-center items-center pt-100px 2xl:pt-250px">
      <img
        src={imgComing}
        className="w-200px xl:w-200px 2xl:w-260px mx-auto mb-10px xl:mb-15px"
      />
      <div className="color-#fff font-800 text-45px xl:text-68px text-center">COMING SOON</div>
    </div>
  );
};
