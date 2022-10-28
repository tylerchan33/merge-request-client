import { useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import { Link } from 'react-router-dom'

export default function EditProfile(props) {
    // const [firstName, setFirstName] = useState(props.currentUser.firstName)
    // const [email, setEmail] = useState(`${props.currentUser.email}`)
    const decode = jwt_decode(localStorage.getItem('jwt'))
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [form, setForm] = useState({})
    const { userId } = useParams()
    const [photo, setPhoto] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    console.log("decode", decode)
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${userId}`)
                console.log(response.data)
                setForm(response.data)
            } catch(err) {
                console.warn(err)
            }
        }
        getUser()
    }, [userId])

    const uploadImage = async e => {
		const files = e.target.files[0];
		const formData = new FormData();
			formData.append('upload_preset', 'oiwq1rx8');
			formData.append('file', files);
			setLoading(true)
			try {
				const response = await axios.post(`https://api.cloudinary.com/v1_1/dspcnzoiy/image/upload`,formData)
				console.log(response.data)
				setPhoto(response.data.url)
				// console.log(photos)
			}catch(err){
				console.warn(err)
			}
	}

    
    
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${userId}/edit`, form)
            const { token } = response.data
            localStorage.setItem("jwt", token)
            const decode = jwt_decode(token)
            props.setCurrentUser(decode)
            navigate(`/profile`)
        } catch(err) {
            console.warn(err)
        }
    }

    const birthYearOptions = [] 
	
		for (var i = 2004; i >= 1922; i--) {
			birthYearOptions.push(<option value={i}>{i}</option>)
		}


    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('jwt')
            const decoded = jwt_decode(token)
            let userId = decoded.id
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api-v1/users/${userId}/edit`, {data: {userId, id}})
            const thisUser ={...props.currentUser}
            props.setCurrentUser(thisUser)
            props.handleLogout()
            navigate(`/`)
            
        } catch (err) {
            console.warn(err)
        }
    }


    return(
    <section className=" py-1 bg-black">
    <div className="w-full lg:w-8/12 px-4 mx-auto mt-6 bg-black">
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-black border-0">
        <div className="rounded-t bg-black mb-0 px-6 py-6 ">
        <div className="text-center flex justify-between">
            <h6 className="text-secondary text-4xl font-code">
            Fix your bug below {props.currentUser.firstName}
            </h6>
        </div>
        </div>
        <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
            <h6 className="text-primary text-2xl mt-3 mb-6 uppercase font-code">
            User Information
            </h6>
            <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" htmlFor="firstName">
                    First Name
                </label>
                <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" value={form.firstName} id="firstName" onChange={e => setForm({...form, firstName: e.target.value})} />
                </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" htmlFor="lastName">
                    Last Name
                </label>
                <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" value={form.lastName} id="lastName" onChange={e => setForm({...form, lastName: e.target.value})}/>
                </div>
            </div>
            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" htmlFor="city">
                    City, State
                </label>
                <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" value={form.city} id="city" onChange={e => setForm({...form, city: e.target.value})} />
                </div>
            </div>


            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" for="birthMonth">
                    Birth Month
                </label>
                <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 font-code" value={form.birthMonth} required id="birthMonth" name="month" onChange={e => setForm({...form, birthMonth: e.target.value})} >
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
            </div>

            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" for="birthDay">
                    Birth Day
                </label>  
                        {form.birthMonth == 2 && form.birthYear % 4 == 0
                        ? 
                        <div>
                        <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 font-code" value={form.birthDay} required id="birthDay" onChange={e => setForm({...form, birthDay: e.target.value})}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                        </select>
                        </div>
                        : 
                        form.birthMonth == 2 && form.birthYear % 4 != 0
                        ? 
                        <div>
                        <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 font-code" value={form.birthDay} required id="birthDay" onChange={e => setForm({...form, birthDay: e.target.value})}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
        
                        </select>
                        </div>
                        :
                        form.birthMonth == 4 || form.birthMonth == 6 || form.birthMonth == 9 || form.birthMonth == 11
                        ? 
                        <div>
                        <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 font-code" value={form.birthDay} required id="birthDay" onChange={e => setForm({...form, birthDay: e.target.value})}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                        </select>
                        </div>
                        :
                        <div>
                        <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 font-code" value={form.birthDay} required id="birthDay" onChange={e => setForm({...form, birthDay: e.target.value})}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>
                        </div>
                        }  
                </div>
            </div>

            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                <label class="block uppercase text-m font-code text-db mb-2" for="birthYear">
                    Birth Year
                </label>
                <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 font-code" value={form.birthYear} required id="birthYear" onChange={e => setForm({...form, birthYear: e.target.value})} >
                    {birthYearOptions}
                </select>
                </div>
            </div>


            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300"/>

            <h6 className="text-primary text-2xl text-code mt-3 mb-6 font-code uppercase">
            Preferences
            </h6>
            <div className="flex flex-wrap">

            <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" for="Gender">
                    Gender
                </label>
                    <div className="block pt-3 pb-2 space-x-4">
                        <label htmlFor='gender' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="Gender"
                            name="Gender"
                            onChange={e => setForm({...form, gender: e.target.value})}
                            value="Man"
                            className="mr-2 text-blac border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            Man
                        </label>
                        <label htmlFor='gender' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="Gender"
                            name="Gender"
                            onChange={e => setForm({...form, gender: e.target.value})}
                            value="Woman"
                            className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            Woman
                        </label>
                        <label htmlFor='gender' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="Gender"
                            name="Gender"
                            onChange={e => setForm({...form, gender: e.target.value})}
                            value="More"
                            className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            More
                        </label>
                    </div>
                </div>
            </div>


            <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" for="lookingFor">
                    I'm Looking For
                </label>
                    <div className="block pt-3 pb-2 space-x-4">
                        <label htmlFor='lookingFor' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="lookingFor"
                            name="lookingFor"
                            onChange={e => setForm({...form, lookingFor: e.target.value})}
                            value="Man"
                            className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            Man
                        </label>
                        <label htmlFor='lookingFor' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="lookingFor"
                            name="lookingFor"
                            onChange={e => setForm({...form, lookingFor: e.target.value})}
                            value="Woman"
                            className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            Woman
                        </label>
                        <label htmlFor='lookingFor' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="lookingFor"
                            name="lookingFor"
                            onChange={e => setForm({...form, lookingFor: e.target.value})}
                            value="Friends"
                            className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            Friends
                        </label>
                        <label htmlFor='lookingFor' className='font-code2 text-yellow'>
                            <input
                            type="radio"
                            id="lookingFor"
                            name="lookingFor"
                            onChange={e => setForm({...form, lookingFor: e.target.value})}
                            value="No Preference"
                            className="mr-2 text-black border-2 border-gray-300 focus:border-gray-300 focus:ring-black"
                            />
                            No Preference
                        </label>
                    </div>
                </div>
            </div>

            

            <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" for="favoriteLanguage">
                    Favorite Programming Language
                </label>
                <select className="border-0 px-3 py-3 placeholder-blueGray-300 text-orange font-code bg-white rounded text-sm shadow focus:outline-none focus:ring w-3/12 ease-linear transition-all duration-150" value={form.favoritePLanguage} required id="favoriteLanguage" name="favoriteLanguage" onChange={e => setForm({...form, favoritePLanguage: e.target.value})}>
                        <option value="Python">Python</option>
                        <option value="JavaScript">Javascript</option>
                        <option value="Java">Java</option>
                        <option value="C#">C#</option>
                        <option value="C">C</option>
                        <option value="C++">C++</option>
                        <option value="GO">GO</option>
                        <option value="R">R</option>
                        <option value="Swift">Swift</option>
                        <option value="PHP">PHP</option>
                        <option value="HTML">HTML</option>
                        <option value="Kotlin">Kotlin</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

        
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300"/>

            <h6 className="text-primary text-2xl mt-3 mb-6 font-code uppercase">
            About Me
            </h6>


            <div className="flex flex-wrap">
            <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                <textarea type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-orange bg-white font-code rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4" onChange={e => setForm({...form, biography: e.target.value})} value={form.biography} id="biography" > Enter a bio and a pick up line here.</textarea>
                </div>
            </div>
            </div>


            <div className="w-full lg:w-12/12 px-4">
                <div className="relative w-full mb-3">
                <label className="block uppercase text-m font-code text-db mb-2" htmlFor="profileimage">
                    Upload a profile picture
                </label>
                <input type="file" name='file' id="profileimage" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-4/12 ease-linear transition-all duration-150 font-code" onChange={uploadImage}/>
                </div>
            </div>

            <div>
            <button
            id="button"
            type="submit"
            className="w-5/12 px-6 py-3 mt-3 text-lg font-code text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-yellow-300 hover:bg-yellow-500 hover:shadow-lg focus:outline-none"
            >
            Update Profile
            </button>
            <button  
            id="delete"
            type="submit"
            className="w-5/12 px-6 py-3 mt-3 text-lg font-code text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-yellow-300 hover:bg-yellow-500 hover:shadow-lg focus:outline-none" onClick={() => handleDelete(`${props.currentUser._id}`)}
            >
            Delete Profile
            </button>
            <button className="w-5/12 px-6 py-3 mt-3 text-lg font-code text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-yellow-300 hover:bg-yellow-500 hover:shadow-lg focus:outline-none" style={{color: 'rgb(242,61,65)'}}>
            <Link to={`/profile/${userId}/secure`}>Secure Settings</Link>
            </button>
            </div>
            
            <hr classNameName="mt-6 border-b-1 border-blueGray-300"/>

            <h6 className="text-primary text-2xl text-2xl font-code mt-3 mb-6 font-bold uppercase">
            Profile Preview
            </h6>

            <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full mb-3">
                { loading ? <img src={photo} style={{height: 250}} alt="profile pic"></img>: <img src={form.photo} alt="profile pic"></img> }
                </div>
            </div>

            
        </form>
        </div>
    </div>
    </div>
    </section>

    )
}