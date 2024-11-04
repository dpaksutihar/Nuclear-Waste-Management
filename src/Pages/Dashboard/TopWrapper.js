import img_cover from '../../Assests/Images/dashboard/top_wrapper.jpg';
const TopWrapper  = () => {
  return (
    <div className="top-wrapper">
      <div className="row d-flex justify-content-between">
        <div className="col-12 col-md-6">
          <img src={img_cover} alt='Cover_Image' width="100%"/>
        </div>
        <div className="col-12 col-md-6">
          <div className="tw-about text-center">
            <p className="tw-heading">
            Nuclear Waste Management ⚛ 🗑 
            </p>
            <p className="tw-sub-heading">
              We plan, implement, and control the movement 
              and storage of Nuclear Waste within a supply chain and 
              between the points of origin and Temporary or Long-term Storage Facility.
            </p>
          </div>
        </div>
      </div>
      <hr/>
    </div>
  ) 
}
export default TopWrapper;