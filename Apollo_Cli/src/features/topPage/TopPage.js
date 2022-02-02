import React from 'react';
import { gql, useQuery } from '@apollo/client';
import MainLayout from 'components/MainLayout/MainLayout';
import { CalCulateTotal, NutritionFactImg } from 'constants/Images/Images';
import { Button } from 'antd';
import { Helmet } from 'react-helmet-async';
// import { GET_FOOD } from 'graphql/Basic/Basic';

const TopPage = () => {


  return (
    <MainLayout>
      <Helmet>
        <title>Food Data</title>
        <meta name="description" content="Helmet application" ></meta>
      </Helmet>
      <div className='banner'>
        <div className='banner__content'>
          <h2 className='banner__title'>Understand what you eat</h2>
        </div>
      </div>
      <section className='card-stack'>
        <div className="card-wrap">
          <div className="feature-text">
            <div className="card-stack__title">Tìm kiếm món ăn</div>
            <div className="card-stack__text">Tìm kiếm món ăn theo tên hoặc hàm lượng chất dinh dưỡng</div>
            <Button href='/tools/search'>Thử ngay</Button>
          </div>
          <div className="feature-item">
            <img alt="image" src={NutritionFactImg}></img>
          </div>
        </div>
      </section>


      <section className='card-stack bg-blue'>
        <div className="card-wrap">
          <div className="feature-text">
            <div className="card-stack__title">Tính toán lượng dinh dưỡng bữa ăn</div>
            <div className="card-stack__text">Tính toán tổng hàm lượng các chất dinh dưỡng bữa ăn theo thành phần</div>
            <Button href='/tools/cacluate-total'>Thử ngay</Button>
          </div>
          <div className="feature-item">
            <img alt="image" src={CalCulateTotal}></img>
          </div>
        </div>
      </section>

      <footer className='page-footer'>
        <div>© 2022 MyFoodData.com</div>
      </footer>
    </MainLayout>
  )
}

export default TopPage