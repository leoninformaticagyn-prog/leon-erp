let estoque=[]
let vendas=[]

function login(){

let u = document.getElementById("user").value
let p = document.getElementById("pass").value

if(u==="Leon" && p==="Leon@017"){

document.getElementById("login").style.display="none"
document.getElementById("app").style.display="block"

}else{

alert("Login inválido")

}

}

function logout(){

location.reload()

}

function show(id){

document.querySelectorAll("section").forEach(s=>s.classList.remove("active"))

document.getElementById(id).classList.add("active")

}

function addEstoque(){

let imei=codigo.value

if(estoque.find(p=>p.codigo===imei)){

alert("IMEI já cadastrado")
return

}

estoque.push({

modelo:modelo.value,
cap:cap.value,
cor:cor.value,
codigo:imei,
custo:parseFloat(custo.value),
milhas:parseFloat(milhasAdd.value)

})

renderEstoque()
dashboard()


}

function renderEstoque(){

tabelaEstoque.innerHTML=""

estoque.forEach(p=>{

tabelaEstoque.innerHTML+=`

<tr>
<td>${p.modelo}</td>
<td>${p.cap}</td>
<td>${p.cor}</td>
<td>${p.codigo}</td>
<td>${p.custo}</td>
<td>${p.milhas}</td>
</tr>

`

})

}

function buscar(){

let t=busca.value.toLowerCase()

tabelaEstoque.innerHTML=""

estoque.filter(p=>

p.codigo.includes(t) ||
p.modelo.toLowerCase().includes(t) ||
p.cap.includes(t) ||
p.cor.toLowerCase().includes(t)

).forEach(p=>{

tabelaEstoque.innerHTML+=`

<tr>
<td>${p.modelo}</td>
<td>${p.cap}</td>
<td>${p.cor}</td>
<td>${p.codigo}</td>
<td>${p.custo}</td>
<td>${p.milhas}</td>
</tr>

`

})

}

function vender(){

let imei=codigoVenda.value

let aparelho=estoque.find(p=>p.codigo===imei)

if(!aparelho){

alert("Aparelho não encontrado")
return

}

let valor=parseFloat(valorVenda.value)

let lucro=valor-aparelho.custo

vendas.push({

cliente:cliente.value,
codigo:imei,
valor,
lucro,
status:status.value

})

estoque=estoque.filter(p=>p.codigo!==imei)

renderEstoque()
renderVendas()
dashboard()

}

function renderVendas(){

tabelaVendas.innerHTML=""

vendas.forEach(v=>{

tabelaVendas.innerHTML+=`

<tr>
<td>${v.cliente}</td>
<td>${v.codigo}</td>
<td>${v.valor}</td>
<td>${v.lucro}</td>
<td>${v.status}</td>
</tr>

`

})

renderReceber()

}

function renderReceber(){

tabelaReceber.innerHTML=""

vendas.filter(v=>v.status==="Pendente")

.forEach(v=>{

tabelaReceber.innerHTML+=`

<tr>
<td>${v.cliente}</td>
<td>${v.valor}</td>
<td><button onclick="marcarPago('${v.codigo}')">Pago</button></td>
</tr>

`

})

}

function marcarPago(c){

let v=vendas.find(x=>x.codigo===c)

v.status="Recebido"

renderVendas()
dashboard()

}

function dashboard(){

let caixa=0
let lucro=0
let milhas=0

vendas.forEach(v=>{

if(v.status==="Recebido") caixa+=v.valor

lucro+=v.lucro

})

estoque.forEach(p=>{

milhas+=p.milhas

})

document.getElementById("caixa").innerHTML="R$ "+caixa
document.getElementById("lucro").innerHTML="R$ "+lucro
document.getElementById("milhas").innerHTML=milhas+" pontos"

}

function backup(){

let data={estoque,vendas}

let blob=new Blob([JSON.stringify(data)],{type:"application/json"})

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="backup_leon_vendas.json"

a.click()

}

function importar(){

let input=document.createElement("input")

input.type="file"

input.onchange=e=>{

let file=e.target.files[0]

let reader=new FileReader()

reader.onload=function(){

let data=JSON.parse(reader.result)

estoque=data.estoque
vendas=data.vendas

renderEstoque()
renderVendas()
dashboard()

}

reader.readAsText(file)

}

input.click()

}

function exportarExcel(){

let texto="Cliente,Código,Valor,Lucro,Status\n"

vendas.forEach(v=>{

texto+=`${v.cliente},${v.codigo},${v.valor},${v.lucro},${v.status}\n`

})

let blob=new Blob([texto])

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="relatorio_vendas.csv"

a.click()

}
function iniciarScanner(){

const html5QrCode = new Html5Qrcode("reader")

html5QrCode.start(
{ facingMode: "environment" },
{ fps: 10, qrbox: 250 },

(code)=>{

document.getElementById("codigo").value = code

html5QrCode.stop()

}

).catch(err=>{
console.log("scanner não iniciado")
})

}

setTimeout(iniciarScanner,1000)
