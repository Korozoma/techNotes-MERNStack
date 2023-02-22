import { useParams } from "react-router-dom"
import EditUserForm from "./EditUserForm"
import { useGetUsersQuery } from "./usersApiSlice"
import PulseLoader from 'react-spinners/PulseLoader'

const EditUser = () => {
    const { id } = useParams()

    const { user } = useGetUsersQuery("userList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    if (!user) return <PulseLoader color={"#FEE"} />

    const content = <EditUserForm user={user} />

    return content
}

export default EditUser