ELEMENT.locale(ELEMENT.lang.en);
var app = new Vue({
    el: '#app',
    data() {
      var checkZipValidator = (rule, value, callback) => {
        if(!value){
          return callback(new Error ('Please, write a zip code'));
        }
        // else if(!Number.isInteger(value)){
        //   return callback(new Error ('Invalid ZIP'));
        // }
        else if(value.toString().length !== 5){
          return callback(new Error ('ZIP must have 5 digits'));
        }else if (!this.checkZip(value)){
          return callback(new Error ('ZIP code does not exists'));
        }else{
          return callback();
        }
      };
        return {
          current_step:1,
          percentage: 0,
          loading:false,
          loadingSearchMake: false,
          lastMessage: false,
          cities: jsonCity,
          houseHold: houseHold,
          coverage: Coverage.reverse(),
          currentDate: '',
          currentIP: '',
          form: {
            step1: {
                zip: '',
                active: true,
                done: false
            },
            step2: {
                quote: '',
                active: false,
                done: false
            },
            step3: {
                looking: '',
                active: false,
                done: false
            },
            stepfamily: {
              looking: '',
              type: 'My Family',
              gender: '',
              tobacco: '',
              height_feet:'',
              height_inches:'',
              weight:'',
              household:'',
              coverage:'',
              term:'',
              disease:'',
              active: false,
              done: false
          },
            step4: {
                street:'',
                city:'',
                state:'',
                active: false,
                done: false
            },
            step5: {
                first_name: '',
                last_name:'',
                phone: '',
                email: '',
                active: false,
                done: false
            },
            step6:{
              active: false,
              done: false
            },
            step7:{
              active: false,
              done: false
            },
            stepcar:{
              looking: '',
              active: false,
              done: false
            },
            stepcarinfo: {
              year: '',
              model: '',
              make: '',
              miles: '',
              optionsMake:[],
              optionsModel:[],
              active: false,
              done: false
            }
          },
          rules: {
            zip: [
              {validator: checkZipValidator, trigger: "change"},
            ],
            quote:[{required: true, message: "Choose one", trigger: "change"}],
            looking:[{required:true, message: "Choose one", trigger: "change" }],
            street:[{required: true, message: "Street field is required", trigger: "blur"}],
            city:[{required: true, message: "City field is required", trigger: "blur"}],
            first_name:[{required: true, message: "First Name field is required", trigger: "blur"}],
            last_name:[{required: true, message: "Last Name field is required", trigger: "blur"}],
            phone:[{required:true, message:"Phone field is required", trigger: "blur"}],
            email:[
              {required: true, message: "Email is required", trigger: "blur"},
              {type:"email", message: "Incorrect email format", trigger: "blur"}
            ],
            birthday:[{required: true, message: "Birthday is required", trigger: "blur"}],
            year:[
              {required: true, message: "Field is required", trigger: "blur"},
            ],
            make:[{required: true, message: "Make field is required", trigger: "change"}],
            model:[{required: true, message: "Model field is required", trigger: "change"}],
            miles:[
              {required: true, message: "Midels field is required", trigger: "change"},
              {type: "number", message: "Miles are numbers", trigger: "change"},
            ],
            gender:[{required:true,message: "Gender required", trigger: "blur"}],
            tobacco:[{required:true,message: "Field required", trigger: "blur"}],
            height_feet:[
              {required:true,message: "Field required", trigger: "change"},
              {type:"number", message: "Height field is a number", trigger: "change"},
              {pattern:/^([3-7]{1})$/, message: "Height should be 3 to 7", trigger: "change"}
            ],
            height_inches:[
              {required:true,message: "Field required", trigger: "change"},
              {type:"number", message: "Height field is a number", trigger: "change"},
              {pattern:/^([1-9]|1[0-1]{1})$/, message: "Height should be 1 to 11", trigger: "change"}
            ],
            weight:[{required:true,message: "Field required", trigger: "blur"}],
            household:[{required:true,message: "Field required", trigger: "blur"}],
            coverage:[{required:true,message: "Field required", trigger: "blur"}],
            term:[{required:true,message: "Field required", trigger: "blur"}],
            disease:[{required:true,message: "Field required", trigger: "blur"}]
          }
         }
        },
        computed:{
          lookingRemaining: function(){
            let looking ='';
            if(this.form.step2.quote == "My Home"){
              switch(this.form.step3.looking){
                case "warranty":
                  looking = "Home Security and Home Improvement";
                  break;
                case "security":
                  looking = "Home Warranty and Home Improvement";
                  break;
                case "improvement":
                  looking = "Home Security and Home Warranty";
                  break;
              }
            }
            if(this.form.step2.quote == "My Car"){
              switch(this.form.stepcar.looking){
                case "warranty":
                  looking = "Car Insurance";
                  break;
                case "insurance":
                  looking = "Car Warranty";
                  break;
              }
            }
            if(this.form.step2.quote == "My Family"){
              switch(this.form.stepfamily.looking){
                case "health":
                  looking = "Life Insurance, Final Expense Insurance, and Medicare Supplement Insurance";
                  break;
                case "life":
                  looking = "Health Insurance, Final Expense Insurance, and Medicare Supplement Insurance";
                  break;
                case "final":
                looking = "Health Insurance, Life Insurance, and Medicare Supplement Insurance";
                break;
                case "medicare":
                  looking = "Health Insurance, Life Insurance, and Final Expense Insurance";
                  break;
              }
            }
            return looking;
          },
          classIcon: function(){
            return {
              "fa-car": this.form.step2.quote == "My Car",
              "fa-home": this.form.step2.quote == '' || this.form.step2.quote == "My Home" || this.form.step2.quote == "My Family"
            }
          }
        },
        watch:{
          'form.step6.active': function(){
            if(this.form.step6.active){
              let dis = this;
              var interval = setInterval(function(){
                if(dis.percentage >= 100){
                  clearInterval(interval);
                  if(dis.form.step2.quote == "My Home"){
                    dis.sendForm({'areyoulooking': dis.form.step3.looking});
                    dis.sendAPI("home");
                  }
                  if(dis.form.step2.quote == "My Family"){
                    dis.sendForm({
                      'areyoulooking': dis.form.stepfamily.looking,
                      'type': dis.form.stepfamily.type,
                      'gender': dis.form.stepfamily.gender,
                      'tobacco': dis.form.stepfamily.tobacco,
                      'height_feet':dis.form.stepfamily.height_feet,
                      'height_inches':dis.form.stepfamily.height_inches,
                      'weight':dis.form.stepfamily.weight,
                      'household':dis.form.stepfamily.household,
                      'coverage':dis.form.stepfamily.coverage,
                      'terms':dis.form.stepfamily.term,
                      'disease':dis.form.stepfamily.disease
                    });
                  }
                  if(dis.form.step2.quote == "My Car"){
                    dis.sendForm({
                      'areyoulooking': dis.form.stepcar.looking,
                      'years': dis.form.stepcarinfo.year,
                      'model': dis.form.stepcarinfo.model,
                      'make': dis.form.stepcarinfo.make,
                      'miles': dis.form.stepcarinfo.miles
                    });
                    dis.sendAPI("car");
                  }
                  dis.form.step7.active = true;
                  dis.form.step6.active = false;
                }else{
                  dis.percentage++;
                }
              },50)
            }
          },
          'form.stepcarinfo.make': function(){
            this.searchModel();
          }
        },
        methods: {
          changeLooking(){
            this.loading = true;
            let looking = '';
            let dis = this;
            if(this.form.step2.quote == "My Home"){
              looking = ["warranty", "security", "improvement"];
              let filtered = looking.filter(function (value){
                return value != dis.form.step3.looking;
              });
              filtered.forEach(function(item,index){
                dis.form.step3.looking = item;
                dis.sendForm({'areyoulooking': dis.form.step3.looking});
              });
            }
            if(this.form.step2.quote == "My Car"){
              looking = ["warranty", "insurance"];
              let filtered = looking.filter(function (value){
                return value != dis.form.stepcar.looking;
              });
              filtered.forEach(function(item,index){
                dis.form.stepcar.looking = item;
                dis.sendForm({
                  'areyoulooking': dis.form.stepcar.looking,
                  'years': dis.form.stepcarinfo.year,
                  'model': dis.form.stepcarinfo.model,
                  'make': dis.form.stepcarinfo.make,
                  'miles': dis.form.stepcarinfo.miles
                });
              });
            }
            if(this.form.step2.quote == "My Family"){
              looking = ["health", "life", "final", "medicare"];
              let filtered = looking.filter(function (value){
                return value != dis.form.stepfamily.looking;
              });
              filtered.forEach(function(item,index){
                dis.form.stepfamily.looking = item;
                dis.sendForm({
                  'areyoulooking': dis.form.stepfamily.looking,
                  'type': dis.form.stepfamily.type,
                  'gender': dis.form.stepfamily.gender,
                  'tobacco': dis.form.stepfamily.tobacco,
                  'height_feet':dis.form.stepfamily.height_feet,
                  'height_inches':dis.form.stepfamily.height_inches,
                  'weight':dis.form.stepfamily.weight,
                  'household':dis.form.stepfamily.household,
                  'coverage':dis.form.stepfamily.coverage,
                  'terms':dis.form.stepfamily.term,
                  'disease':dis.form.stepfamily.disease
                });
              });
            }
            this.loading = false;
            this.lastMessage = true;
          },
          sendForm: function(extradata={}) {
            const emailBody = {
              "zip": this.form.step1.zip,
              "quote": this.form.step2.quote,
              "street": this.form.step4.street,
              "city": this.form.step4.city,
              "state": this.form.step4.state,
              "infoName": this.form.step5.first_name+' '+this.form.step5.last_name,
              "phone": this.form.step5.phone,
              "email": this.form.step5.email,  
              "birthday": this.form.step5.birthday       
            }
            Object.assign(emailBody, extradata);
            const form = new FormData();
            for(const field in emailBody){
              form.append(field,emailBody[field]);
            }
            const requestOptions = {
              method: "POST",
              body: form
            };
            fetch(`/wp-json/contact-form-7/v1/contact-forms/${php_data.contact_id}/feedback`, requestOptions)
            .then(response => response.json())
            .then(data => {console.log(data)})
            .catch(error => {
              alert(error);
            })
          },
          submitForm(reference, currentValue, nextValue, second_reference = null) {
            let form1 = false;
            let form2 = null;
            this.$refs[reference].validate((valid) => {
              if (valid) {
                form1 = true;
              } else {
                console.log('error submit!!');
                return false;
              }
            });
            if(second_reference != null){
              this.$refs[second_reference].validate((valid) => {
                if(valid){
                  form2 = true;
                } else {
                  console.log('error submit!!');
                  form2 = false;
                  return false;
                }
              })
            }
            if(form1 && (form2 == null || form2 == true) ){
              currentValue.done = true;
              currentValue.active = false;
              nextValue.active = true
            }
          },
          submitFormQuote(reference, currentValue) {
            let dis = this;
            this.$refs[reference].validate((valid) => {
              if (valid) {
                currentValue.done = true;
                currentValue.active = false;
                switch(dis.form.step2.quote){
                  case 'My Home':
                  dis.form.step3.active = true;
                  break;
                  case 'My Car':
                  dis.form.stepcar.active = true;
                  break;
                  case 'My Family':
                  dis.form.stepfamily.active = true;
                }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          previousForm(previous, current){
            current.active = false;
            current.done = false;
            previous.active = true;
            previous.done = false;            
          },
          previousFormQuote(current){
            current.active = false;
            current.done = false;
            switch(this.form.step2.quote){
              case 'My Home':
              this.form.step3.active = true;
              this.form.step3.done = false;
              break;
              case 'My Car':
              this.form.stepcarinfo.active = true;
              this.form.stepcarinfo.done = false;
              case 'My Family':
                this.form.stepfamily.active = true;
                this.form.stepfamily.done = false;
            }
          },
          checkZip(value){
            let conca = "";
            let city = this.cities.find((x)=>{
              let zip = x.zip_code.toString();
              if(zip.length === 3){
                zip = "00"+zip
              }
              if(zip.length === 4){
                zip = "0"+zip;
              }
              return zip === value;
            });
            if(!city){
              return false;
            }else {
              console.log(city);
              this.form.step4.city = city.city;
              this.form.step4.state = city.state;
              return true;
            }
          },
          searchMake(query){
            if(query!=='' || query.length > 3){
              this.loadingSearchMake = true;
              fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetMakeForManufacturer/${query}?format=json`)
              .then((resp) => resp.json())
              .then(data => {
                let uniqueArray = this.getUniqueMake(data.Results);
                let options = uniqueArray.map(item => {
                  return {value: `${item.Make_Name}`, label: `${item.Make_Name}`}
                });
                this.form.stepcarinfo.optionsMake = options;
                this.loadingSearchMake = false;
              })
            }
          },
          searchModel(){
           fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${this.form.stepcarinfo.make}?format=json`)
            .then((resp) => resp.json())
            .then(data => {
              let options = data.Results.map(item => {
                return {value: `${item.Model_Name}`, label: `${item.Model_Name}`}
              });
              this.form.stepcarinfo.optionsModel = options;
            });
          },
          getUniqueMake(arr){
            const filteredArr = arr.reduce((acc, current) => {
              const x = acc.find(item => item.Make_ID === current.Make_ID);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            return filteredArr;
          },
          convertInttoBool(integer){
            return integer === 1;
          },
          async sendAPI(type){
            this.getCurrentDate();
            this.getIP();
            let emailBody = {
              "publisherid": 51937,
              "firstname": this.form.step5.first_name,
              "lastname": this.form.step5.last_name,
              "email": this.form.step5.email,
              "phone": this.form.step5.phone,
              "address": this.form.step4.street,
              "city": this.form.step4.city,
              "state": this.form.step4.state,
              "zipcode": this.form.step1.zip,
              "signupdt": this.currentDate,
              "signupip2": this.currentIP,
              "jornaya_lead_id": document.getElementById("leadid_token").value,
              "xxtrustedformcerturl": document.getElementById("xxTrustedFormCertUrl_2").value
            };
            if(type=="home"){
              let homeBody = {
                "campaignid": 11207,
                "sourceid": 6252,
              }
              Object.assign(emailBody,homeBody);
            }
            if(type=="car"){
              let carBody = {
                "campaignid": 11208,
                "sourceid": 6253,
                "year": this.form.stepcarinfo.year,
                "make": this.form.stepcarinfo.make,
                "model": this.form.stepcarinfo.model,
                "mileage": this.form.stepcarinfo.miles
              }
              Object.assign(emailBody,carBody);
            }
            console.log(emailBody);
            // fetch("https://www.lc2trk.com/leadpost/",{method: "POST",body:JSON.stringify(emailBody)})
            fetch("https://www.lc2trk.com/leadpost/get.php?"+ new URLSearchParams(emailBody).toString(),{method:"GET"})
            .then(response => response.json())
            .then(data => {console.log(data)})
            .catch(error => {
              console.log(error);
            })
          },
          getIP(){
            const IPvalue = fetch('https://api.ipify.org?format=json',{method: "GET"})
            .then(response => response.json())
            .then(res => {
              return res.ip;
            })
            .catch(data => console.log(data));

            this.currentIP = IPvalue;
          
          },
          getCurrentDate(){
            var today = new Date();
            var month = ("0" + (today.getMonth() + 1)).slice(-2);
            var date = today.getFullYear()+'-'+month+'-'+("0" + (today.getDate() + 1)).slice(-2);
            var time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + (today.getMinutes() + 1)).slice(-2) + ":" + ("0" + (today.getSeconds() + 1)).slice(-2);
            this.currentDate = date+' '+time;
          }
        }
  });