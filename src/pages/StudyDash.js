import React, {useState, useEffect} from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Layout, Row,Col, Typography} from 'antd'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import MobileHeader from '../components/components/MobileHeader';
import '../styles/CSS/Userdash.css'
import StudyDash_Mobile from './StudyDash_mobile';


const { Title } = Typography;

const StudyDash = () => {
    const { Header, Content, Sider } = Layout;

    return (
      <div>
        <div className="study-dash">
            <Layout>
            <Sider className='sidebar' >
                    <Sidebar/>
                </Sider>
               <Layout >
                <Header className="header" style={{ padding: 0, background:'#f2f2f2' }} >
                        <Headers/>
                </Header>
                <div className="mobile-header">
                    <MobileHeader/>
                </div>
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' , minHeight: "100vh"}}>
                        <Label/>
                        <Row gutter={16}>
                            <Col span={12}><Documentation/></Col>
                            <Col span={12} style={{overflowY: 'scroll', height: '740px'}}>
                                <Title level={2}>Tasks</Title>
                                 <Tasks/>
                            </Col>
                        </Row>
                        <DataGrid/>
                    </Content>
               </Layout>
            </Layout>
        </div>
        <StudyDash_Mobile/>
        </div>
    )
}

export default StudyDash
