import React, {useEffect, useState} from 'react'
import {Form, Button, DatePicker, Space, Input, Select, notification} from 'antd'
import '../styles/CSS/Userdash.css'
import { onStudyCreate } from '../services/studyAPI';
import { onGetAllUsers } from '../services/userAPI';
import { useSelector } from 'react-redux';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { onGetAllProject } from '../services/projectAPI';


const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };


const AddStudy = () => {
    const { Option } = Select;
    const userObj = useSelector(state => state.user)
    const authObj = useSelector(state => state.auth)

    const [userData, setUserData] = useState([])
    const [projectData, setProjectData] = useState([])
    const [study, setStudy] = useState({title: "", projectName: '', deadline:"", startDate: "" ,assignee:[], assigneeName:[], budget: "", user: userObj.USER._id, username: userObj.USER.name})


    const initialValues = {title: "", deadline:"", startDate: "" ,assignee:[], assigneeName:[], budget: ""}

    const [form] = Form.useForm();
    
    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

      function handleChange(value) {   //for assigning user
        let tempArray =[]
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        });
        setStudy({...study, assignee: value, assigneeName: tempArray})
    }

    function handleChangeProject(value) {   //for assigning user
        let tempArray =[]
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        });
        setStudy({...study, assignee: value, assigneeName: tempArray})
    }

    
    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllUsers()
            let resultProj = await onGetAllProject()
            let x = resultUsers.data
            let y = resultProj.data
            console.log(y)
            let tempUserData = []
            let tempProjData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i].name,
                    name:  x[i].name,
                    value:  x[i]._id,
                })
            }
            for(let i = 0; i < y.length; i++){ 
                tempProjData.push({
                    key: y[i].projectID,
                    name:  y[i].projectName,
                    value:  y[i].projectID,
                })
            }
            setUserData(tempUserData)
            setProjectData(tempProjData)
        }
        getUsers()
    }, [])
    
    async function onSubmit(values){
        try {
           let result = await onStudyCreate({values, study}, authObj.accessToken, authObj.refreshToken) 
           notif("success",result.data.message)
           form.resetFields()
           setStudy({title: " ", projectName:" ", deadline:"",assignee:[], startDate:''})
        } catch (error) {
            notif("error", error)
        }
    }

    function onChangeStartDate(date) {
        setStudy({...study, startDate: date})
    }

    function onChange(date) {
        setStudy({...study, deadline: date})
    }

    return (
        <Form initialValues={initialValues} form={form} onFinish={onSubmit} name="dynamic_form_item" {...formItemLayoutWithOutLabel}>
            <Form.Item  name='title' label="Study Title"
            rules={[
                {
                required: true,
                message: 'Please input your title!',
                },
            ]}>
                <Input placeholder="Enter Title" onChange={e => setStudy({...study, title: e.target.value})} value={study.title}></Input>
            </Form.Item>
            <Form.Item  name='project' label="Project"
                    rules={[
                    {
                        required: true,
                        message: 'Please select project!',
                    },
                    ]}>
                <Select mode="tags" style={{ width: '100%' }} onChange={handleChangeProject} tokenSeparators={[',']} value={study.projectName} placeholder="Assign Project">
                {projectData.map(proj => (
                    <Option key={proj.key} value={proj.value}>{proj.name}</Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item name='budget'  label="Budget"
                    rules={[
                    {
                        required: true,
                        message: 'Please enter budget!',
                    },
                    ]}>
                <Input type="number" placeholder="Enter budget" onChange={(e)=> setStudy({...study, budget: e.target.value})} value={study.budget}/>
            </Form.Item>
            <Form.Item   label="Start Date"
                    rules={[
                    {
                        required: true,
                        message: 'Please input start date of study!',
                    },
                    ]}>
                <Space direction="vertical">
                <DatePicker value={study.startDate} onChange={onChangeStartDate}/>
                </Space>
            </Form.Item>
            <Form.Item  label="Deadline"
                    rules={[
                    {
                        required: true,
                        message: 'Please input deadline of study!',
                    },
                    ]}>
                <Space direction="vertical">
                <DatePicker value={study.deadline} onChange={onChange}/>
                </Space>
            </Form.Item>
            <Form.List
                name="objectives"
                rules={[
                {
                    validator: async (_, objective) => {
                    if (!objective || objective.length < 2) {
                        return Promise.reject(new Error('At least 2 objectives'));
                    }
                    }
                },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                <>
                    {fields.map((field, index) => (
                    <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Objectives' : ''}
                        required={false}
                        key={field.key}
                    >
                        <Form.Item
                        {...field}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                            {
                            required: true,
                            whitespace: true,
                            message: "Please input objective or delete this field.",
                            },
                        ]}
                        noStyle
                        >
                        <TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="Objective" style={{width: '95%'}} />
                        </Form.Item>
                        {fields.length > 1 ? (
                        <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                        />
                        ) : null}
                    </Form.Item>
                    ))}
                    <Form.Item>
                    <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '100%' }}
                        icon={<PlusOutlined />}
                    >
                        Add objective
                    </Button>
                    <Form.ErrorList errors={errors} />
                    </Form.Item>
                </>
                )}
            </Form.List>
            <Form.Item  name='assignee' label="Assignee"
                    rules={[
                    {
                        required: true,
                        message: 'Please assign the study!',
                    },
                    ]}>
                <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={study.assignee} placeholder="Assign Study">
                {userData.map(user => (
                    <Option key={user.key} value={user.value}>{user.name}</Option>
                ))}
                </Select>
            </Form.Item>
            <Button htmlType='submit' block style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE STUDY</Button>
        </Form>
    )
}

export default AddStudy