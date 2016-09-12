//// Run in Windows 
//// cd to mongo.exe
//// .\mongo.exe C:\Users\cdisciascio\Desktop\mg-init.js 


var conn = new Mongo()

// development
//db = connect('mg-registration-development')
// test
db = conn.getDB('mg-registration-test')
// production
//db = connect('mg-registration-production')



db.users.remove({})
//db.user.remove({ 'login.username': 'gmuellerputz'});
//db.user.remove({ 'login.username': 'rrupp'});
//db.user.remove({ 'login.username': 'kctest'});

db.users.insert({
    personal_data: {
        first_name: 'Gernot',
        last_name: 'Mueller-Putz',
        institution: 'TUG',
        country: 'Austria',
        city: 'Graz',
		phone: '',
        email: 'gernot.mueller@tugraz.at'
    },
    preferences: {
        notify_new_registration: false
    },
    login: {
        username: 'gmuellerputz',
		password: 'default'
    }
})

db.users.insert({
    personal_data: {
        first_name: 'Ruediger',
        last_name: 'Rupp',
        institution: 'UKL-HD',
        country: 'Germany',
        city: 'Heidelberg',
		phone: '',
        email: 'ruediger.rupp@med.uni-heidelberg.de'
    },
    preferences: {
        notify_new_registration: false
    },
    login: {
        username: 'rrupp',
		password: 'default'
    }
})

db.users.insert({
    personal_data: {
        first_name: 'KC',
        last_name: 'Test',
        institution: 'KNOW',
        country: 'Austria',
        city: 'Graz',
		phone: '',
		email: 'cdisciascio@know-center.at'
    },
    preferences: {
        notify_new_registration: true
    },
    login: {
        username: 'kctest',
		password: 'default'
    }
})

cursor = db.users.find()
while(cursor.hasNext()) {
	printjson(cursor.next())
}