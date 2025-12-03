const data1 = {
    name: "Test",
    email: "haha@gmail.com"
}
const data2 = {
    name: "john",
    email:"jajafkl"
}
const { name , email } = data2

const update = {...data1, name , email}
console.log(update)