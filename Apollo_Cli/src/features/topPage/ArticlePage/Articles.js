import MainLayout from "components/MainLayout/MainLayout";
import React from "react";
import { useParams } from "react-router";
import { NutrientArticle } from "./NutrientArticle";
import { orderByFact, ALL_NUTRIENT } from "graphql/Basic/Basic";
import { useQuery } from "@apollo/client";
import { message, Result, List, Typography } from "antd";
import dotenv from 'dotenv'
const server = process.env.REACT_APP_SERVER

dotenv.config();

const { Title } = Typography;
const Articles = () => {
  const { slug } = useParams()

  const GETDATA = orderByFact(slug)

  const { data } = useQuery(GETDATA, {
    variables: {
      nutrient: slug
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const content = NutrientArticle.find(item => item.param === slug)
  // console.log(GETDATA);
  // data && console.log(data);
  console.log(content);
  return (
    <MainLayout>
      {
        (!content) ?
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
          >

          </Result> :

          <div className="articles-content">
            <div className="articles-info">
              <Title level={4}>{content.title}</Title>
              <img
                className="articles-img"
                alt='photo-content'
                src={content.image}
              />
              <div style={{ marginTop: "3rem" }}>
                <Title level={5}>{content.content}</Title>
              </div>
            </div>
            <List
              itemLayout="vertical"
              size="large"
              className="articles-list"
              pagination={false}
              dataSource={data && data?.orderFoodByNutrient}
              renderItem={(item, index) => (
                <List.Item
                  key={item.id}
                  extra={
                    <img
                      width={100}
                      alt="logo"
                      src={`${server}${item.image}`}
                      className="article-foodimg"
                    />
                  }
                >
                  <List.Item.Meta
                    title={`#${index + 1} ${item.name}`}
                    description={item.group.groupName}
                  />
                  Hàm lượng {slug} mỗi 100 g thực phẩm <br />
                  {item.basicNutrients[slug]}
                </List.Item>
              )}
            >

            </List>
          </div>
      }
    </MainLayout >
  )
}

export default Articles