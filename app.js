let estoque=[]
let vendas=[]
let scanner=null

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

if(id==="estoque") iniciarScanner()

}

function iniciarScanner(){

if(scanner) return

scanner = new Html5Qrcode("reader")

scanner.start(
{ facingMode: "environment" },
{ fps: 10, qrbox: 250 },
(code)=>{

document.getElementById("codigo").value = code

scanner.stop()
scanner=null

}
)

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
custo:parseFloat(custo.value) || 0,
milhas:parseFloat(milhasAdd.value) || 0

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
