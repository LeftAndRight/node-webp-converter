import {execFileSync} from 'child_process';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as webpbin from 'cwebp-bin';


let input   = '';
let output  = '';
if (process.argv[2] == null){
    throw new Error('Invalid arguments');
}
else{
    input   = process.argv[2];
    output  = input;
    if (output.indexOf('.') !== -1){
        output = output.substr(0, output.lastIndexOf('.'));
    }
    output  += '.webp';
}
if (!fs.existsSync(input)){
    throw new Error('Input file does not exist');
}
if (fs.existsSync(output)){
    throw new Error('Output file already exists');
}

inquirer
    .prompt([
        {type:'list', name:'quality', message:'Please select a conversion quality', default:'80', choices: [
            {name:'100%', value:'100'},
            {name:'90%', value:'90'},
            {name:'80%', value:'80'},
            {name:'70%', value:'70'},
            {name:'60%', value:'60'},
            {name:'Custom Value', value:'custom'},
        ]}
    ])
    .then(answers => {
        if (answers['quality'] === 'custom'){
            return inquirer.prompt({type:'input', name:'quality', message:'Please enter a conversion quality'});
        }
        else{
            return Promise.resolve(answers);
        }
    })
    .then(answers => {
        console.log('Arguments: ', answers);

        //console.log('relative path: ', relativePath);
        execFileSync(webpbin, `${input} -q ${answers['quality']} -o ${output}`.split(' '));
    });