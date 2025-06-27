export async function checkLoginStatus(){
    try{
        const token = chrome.storage.local.get('EllaToken')
        const res = await fetch('api/users/profile',{
            method: 'GET',
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        if(!res.ok){
            console.log('not authenticated');
        }
        const user = await res.json();
        return {loggedIn: true,user}

    }catch(err){
        return {loggedIn:false,user:null};
    }
}