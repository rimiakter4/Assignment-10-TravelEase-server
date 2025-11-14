const express =require("express")
const app =express()
const cors=require("cors")
const port =process.env.PORT||3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


app.use(cors({
  origin: "http://localhost:5173",  
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q32hk1x.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {

    await client.connect();
    const db=client.db("travelease_db")
  const Vehiclecollections=db.collection("vehicles")
     const userscollection=db.collection('users')
        const bookingsCollection = db.collection("bookings");
// bokking collection
app.post("/bookings", async (req, res) => {
  const { vehicleId, userEmail, date } = req.body;
  const vehicle = await Vehiclecollections.findOne(
    { _id: new ObjectId(vehicleId) }
  );
  if (!vehicle) {
    return res.status(404).send({ message: "Vehicle not found" });
  }
  const bookingData = {
    vehicleId,
    userEmail,
    date,
    status: "Pending",
    vehicleName: vehicle.vehicleName,
    coverImage: vehicle.coverImage,
    pricePerDay: vehicle.pricePerDay,
    category: vehicle.category,
    date: new Date().toISOString(),
    location: vehicle.location,
  };

  const result = await bookingsCollection.insertOne(bookingData);
  res.send(result);
});


app.delete('/bookings/:id',async(req,res)=>{
            const id=req.params.id
            const qurey={_id: new ObjectId(id)}
            const result=await bookingsCollection.deleteOne(qurey)
            res.send(result)
        })    



app.get('/bookings',async(req,res)=>{

    const cursor=bookingsCollection.find().sort({pricePerDay:1})
            const result=await cursor.toArray()
            res.send(result)
})

// vehicles
app.post('/vehicles', async (req, res) => {
  const newvehicle = req.body;
  console.log("New Vehicle Received:", newvehicle);

  try {
    const result = await Vehiclecollections.insertOne(newvehicle);
    res.send(result);
  } catch (error) {
    console.error("Error inserting vehicle:", error);
    res.status(500).send({ message: "Failed to add vehicle" });
  }
});

app.get('/vehicles',async(req,res)=>{
    const cursor=Vehiclecollections.find().sort({created_at:-1}).limit(6)
            const result=await cursor.toArray()
            res.send(result)
})


app.get('/all-vehicles',async(req,res)=>{
  const cursor=Vehiclecollections.find().sort({created_at:-1})
  const result=await cursor.toArray()
  res.send(result)
})

   app.get('/all-vehicles/:id',async(req,res)=>{
            const id=req.params.id
            const qurey={_id : new ObjectId(id)}
            const result=await Vehiclecollections.findOne(qurey)
            res.send(result)
        })

app.post



app.get("/my-vehicles", async (req, res) => {
  const email = req.query.email; 
  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  const vehicles = await Vehiclecollections.find({ userEmail: email }).toArray();
  res.send(vehicles);
});

app.patch('/all-vehicles/:id',async(req,res)=>{
            const id=req.params.id
            const newprodct=req.body
            const qurey={_id : new ObjectId(id)}
            const update = {
  $set: {
    vehicleName: newprodct.vehicleName,
    owner: newprodct.owner,
    category: newprodct.category,
    location: newprodct.location,
    pricePerDay: newprodct.pricePerDay,
    availability: newprodct.availability,
    description: newprodct.description,
    coverImage: newprodct.coverImage
  }
};

    
            const result=await Vehiclecollections.updateOne(qurey,update)
            res.send(result)
});

       
app.delete('/all-vehicles/:id',async(req,res)=>{
            const id=req.params.id
            const qurey={_id: new ObjectId(id)}
            const result=await Vehiclecollections.deleteOne(qurey)
            res.send(result)
        })    

// user api s 
 app.post('/users',async(req,res)=>{
            const newuser=req.body
            const email=newuser.email
            const qurey={email:email}
            const existingUser=await userscollection.findOne(qurey)
            if(existingUser){
                res.send({message:"user alredy exiatis"})

            }
            else{
   const result=await userscollection.insertOne(newuser)
            res.send(result)
            }
         
        })
 






    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('travelids server is running on port ')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

