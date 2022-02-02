import { Result, Button } from 'antd';
import { Status } from 'features/pageErrors/Status';

const ErrorPage = ({ status, redirect }) => {

  const code = Status.find(item => item.status === status);

  return (
    <Result
      status={code.status}
      title={code.status}
      subTitle={code.subTitle}
      extra={<Button type="primary">Back Home</Button>}
    />
  )

}

export default ErrorPage;