$Juego = {};
$Juego.activo = true;
$Juego.__construct = function()
{
    var container = document.createElement("div");
    container.setAttribute("id","container");
    var rompe = document.createElement("img");
    rompe.setAttribute("src","imagenes/logo1.png");
    rompe.setAttribute("id","rompe");
    rompe.setAttribute("class","rompe");
    var cabeza = document.createElement("img");
    cabeza.setAttribute("draggable","true");
    cabeza.setAttribute("id","cabeza");
    cabeza.setAttribute("src","imagenes/logo2.png");
    cabeza.setAttribute("ondragstart","$Juego.drag(event)");
    cabeza.setAttribute("class","pieza");
    var encaje = document.createElement("div");
    encaje.setAttribute("id","encaje");
    encaje.setAttribute("class","encaje");
    encaje.setAttribute("draggable","true");
    encaje.setAttribute("ondrop","$Juego.drop(event)");
    encaje.setAttribute("ondragover","$Juego.adrag(event)");
    container.appendChild(encaje);
    container.appendChild(cabeza);
    container.appendChild(rompe);
    document.body.appendChild(container);
    var eclipse = document.createElement("div");
    eclipse.setAttribute("id","eclipse");
    eclipse.setAttribute("class","dia");
    document.body.appendChild(eclipse);
}
$Juego.drag = function(e)
{
    e.dataTransfer.setData("text/html",e.target.id);
}
$Juego.adrag = function(e)
{
    e.preventDefault();
}

$Juego.drop = function(e)
{
    e.preventDefault();
    var data = e.dataTransfer.getData("text/html");   
    e.target.appendChild(document.getElementById(data));
    this.$("cabeza").removeAttribute("draggable","");
    this.$("cabeza").removeAttribute("ondragstart","");
    this.$("cabeza").removeAttribute("class","");
    this.$("encaje").removeAttribute("ondrop","");
    this.$("encaje").removeAttribute("ondragover","");
    $Juego.startRompecabezas();
}
$Juego.$ = function(label){return document.getElementById(label);}
$Juego.startRompecabezas = function()
{
    document.body.setAttribute("style","background-color:#59B300;");
    this.$("container").setAttribute("style","margin-left:-500px;transition:1s;transform:scale(.5);");
    var cargador = document.createElement("input");
    cargador.setAttribute("id","cargador");
    cargador.setAttribute("type","file");
    cargador.setAttribute("onchange","$Juego.cargarImagen(this)");
    document.body.appendChild(cargador);
    var btncarga = document.createElement("div");
    btncarga.setAttribute("id","btncarga");
    btncarga.setAttribute("class","botoncarga");
    btncarga.setAttribute("onclick","$Juego.$('cargador').click();");
    btncarga.innerHTML = "Cargar";
    document.body.appendChild(btncarga);
    var contenedor = document.createElement("div");
    contenedor.setAttribute("id","contenedor");
    contenedor.setAttribute("class","contenedor");
    var fila = 0;
    for(var i = 0; i < 20;i++)
    {
        fila=(fila==5)?0:fila++;
        var imagen = document.createElement("div");
        imagen.setAttribute("class","cuadrito");
        contenedor.appendChild(imagen);
    }
    document.body.appendChild(contenedor);
}
$Juego.cargarImagen = function(t)
{
    $Juego.$("btncarga").innerHTML = "Espere ...";
    var img = this.$("img") || document.createElement("div");
    img.setAttribute("id","img");
    document.body.appendChild(img);
    var reader = new FileReader();
    reader.onload = function(e){
        $Juego.$("img").setAttribute("style","background:url('"+e.target.result+"')");
        $Juego.pedirImagen();
    }
    reader.readAsDataURL(this.$("cargador").files[0]);
}
$Juego.temp = null;
$Juego.tempid = null;
$Juego.cambiar = function(e)
{
    this.temp = this.$("temp").getAttribute("style");
    this.$("temp").setAttribute("style",e.getAttribute("style"));
    e.setAttribute("style",this.temp);
   
    this.tempid = this.$("temp").getAttribute("n");
    this.$("temp").setAttribute("n",e.getAttribute("n"));
    e.setAttribute("n",this.tempid);
   
    var partes = this.$("contenedor").getElementsByTagName("div");
    var cadena = "";
    for(var i = 0; i < partes.length;i++){
        cadena += ""+partes[i].getAttribute("n");
    }
    if(cadena=="012345678910111213141516171819"){
        $Juego.efectoWin();
    }
}
$Juego.efectoWin = function()
{
    this.$("contenedor").setAttribute("style","background-color:white;box-shadow:0px 0px 5px #fff;");
    setTimeout("$Juego.ganado();",1000);
}
$Juego.score = function()
{
    var nombre = this.$("nombre").value;
    nombre = (nombre!="") ? nombre : "Anonimo";
    var score = nombre+"="+this.segundos;
    var data = localStorage.getItem("scores");
    data = (data==null) ? "" : data;
    localStorage.setItem("scores",data+"|"+score);
    var scores = localStorage.getItem("scores").split("|");
    var aux;
    for(var i = 0; i < scores.length-1;i++)
    {
        for(var j = 0; j < scores.length-1;j++){
            if(parseInt(scores[j].split("=")[1]) > parseInt(scores[j+1].split("=")[1]))
            {
                aux = scores[j];
                scores[j] = scores[j+1];
                scores[j+1] = aux;
            }
        }
    }
    this.$("contenido").innerHTML = "";
    var table = document.createElement("div");
    table.setAttribute("class","scores");
    var span;
    var i = 0;
    for(var s in scores)
    {
        if(i == 0){
            span = document.createElement("span");
            span.innerHTML = "Lugar";
            span.setAttribute("class","score");
            table.appendChild(span);
            span = document.createElement("span");
            span.innerHTML = "Jugador";
            span.setAttribute("class","score");
            table.appendChild(span);
            span = document.createElement("span");
            span.setAttribute("class","score");
            span.innerHTML = "Tiempo jugado";
            table.appendChild(span);
        } else {
        span = document.createElement("span");
        span.innerHTML = i;
        span.setAttribute("class","score");
        table.appendChild(span);
        span = document.createElement("span");
        span.innerHTML = scores[s].split("=")[0];
        span.setAttribute("class","score");
        table.appendChild(span);
        var seg = parseInt(scores[s].split("=")[1]);
        var s = ((seg)%60);
        var m = (m>59)?0:parseInt(seg/60);
        var h = parseInt(m/60);
       
        s = (s.toString().length < 2) ?"0"+s:s;
        m = (m.toString().length < 2) ?"0"+m:m;
        h = (h.toString().length < 2) ?"0"+h:h;
       
        span = document.createElement("span");
        span.setAttribute("class","score");
        span.innerHTML = h+":"+m+":"+s;
        table.appendChild(span);
        }
        i++;
    }
    this.$("contenido").appendChild(table);
    var btnScore = document.createElement("div");
    btnScore.setAttribute("id","btnScore");
    btnScore.setAttribute("class","btnScore");
    btnScore.setAttribute("onclick","location.reload()");
    btnScore.innerHTML = "Salir";
    this.$("contenido").appendChild(btnScore);
}
$Juego.ganado = function()
{
    this.activo = false;
    var s = (this.segundos%60);
    var m = (m>59)?0:parseInt(this.segundos/60);
    var h = parseInt(m/60);
   
    s = (s.toString().length < 2) ?"0"+s:s;
    m = (m.toString().length < 2) ?"0"+m:m;
    h = (h.toString().length < 2) ?"0"+h:h;
   
    var eclipse = this.$("eclipse") || document.createElement("div");
    eclipse.setAttribute("class","eclipse");
    var contenido = document.createElement("div");
    contenido.setAttribute("id","contenido");
    contenido.innerHTML = "<center><h2>Fin del juego</h2><b>Tiempo transcurrido:</b> "+h+":"+m+":"+s+"</center><br><br><br><br>Introduce tu nombre:</b>";
    var input = document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("id","nombre");
    input.focus();
    var btnScore = document.createElement("div");
    btnScore.setAttribute("id","btnScore");
    btnScore.setAttribute("class","btnScore");
    btnScore.setAttribute("onclick","$Juego.score()");
    btnScore.innerHTML = "Guardar";
    contenido.appendChild(input);
    contenido.appendChild(btnScore);
    eclipse.appendChild(contenido);
}
$Juego.pedirImagen = function()
{
    var imagen = this.$("img").getAttribute("style");
    var partes = this.$("contenedor").getElementsByTagName("div");
    var fila = 0;
    var colum;
    for(var i = 0; i < partes.length;i++)
    {
        fila=(i%5==0)?i/5:fila;
        colum = i%5;
        m = fila * 100;
        n = colum * 100;
        partes[i].setAttribute("style",imagen+"-"+n+"px -"+m+"px no-repeat");
        partes[i].setAttribute("onclick","$Juego.cambiar(this)");
        partes[i].setAttribute("n",i);
    }
    var boton = this.$("botonstart") || document.createElement("div");
    boton.setAttribute("id","botonstart");
    boton.setAttribute("class","botonstart");
    boton.setAttribute("onclick","$Juego.jugar();");
    boton.innerHTML = "Jugar";
    this.$("btncarga").innerHTML = "Cargar";
    document.body.appendChild(boton);
}
$Juego.jugar = function()
{
    $Juego.rompecabezas(0);
}
$Juego.segundos = 0;
$Juego.reloj = function()
{
    this.segundos++; // areglar reloj
    var s = (this.segundos%60);
    var m = parseInt(this.segundos/60)%60;
    var h = parseInt(m/60);
   
    s = (s.toString().length < 2) ?"0"+s:s;
    m = (m.toString().length < 2) ?"0"+m:m;
    h = (h.toString().length < 2) ?"0"+h:h;
   
    var reloj = this.$("reloj") || document.createElement("div");
    reloj.setAttribute("id","reloj");
    reloj.setAttribute("class","reloj");
    reloj.innerHTML = "<h3>Tiempo transcurrido</h3><br>"+h+":"+m+":"+s;
    document.body.appendChild(reloj);
    if($Juego.activo)
    setTimeout("$Juego.reloj()",1000);
}
$Juego.rompecabezas = function(cont)
{
    try{this.$("btncarga").parentNode.removeChild(this.$("btncarga"));
    this.$("botonstart").parentNode.removeChild(this.$("botonstart"));}catch(x){}
    var cubre = this.$("cubre") || document.createElement("div");
    cubre.setAttribute("id","cubre");
    cubre.innerHTML = "Revolviendo";
    cubre.setAttribute("class","cubre");
    document.body.appendChild(cubre);
    var partes = this.$("contenedor").getElementsByTagName("div");
    this.newPartes = Array(partes.length);
    var rnd = this.rellenarrompe();
    var newPartes = new Array(19);
    var c = 0;
    for(var i = 0; i < newPartes.length;i++)
    {
        while(newPartes[rnd] != "undefined" && c<20)
        {
            rnd = this.rellenarrompe();
            c++;
        }
        partes[i].setAttribute("class","cuadrito2");
        newPartes[rnd] = partes[rnd];
        this.$("contenedor").appendChild(partes[rnd]);
    }
    if(cont < 20){
        setTimeout("$Juego.rompecabezas("+(cont+1)+");",200);
    } else {
        this.removeCubre();
    }
}
$Juego.removeCubre = function()
{
        var temp = document.createElement("div");
        temp.setAttribute("class","temp");
        temp.setAttribute("style","background:white;");
        temp.setAttribute("id","temp");
        temp.setAttribute("n","temp");
        document.body.appendChild(temp);
        this.$("cubre").parentNode.removeChild(this.$("cubre"));
        $Juego.reloj();
}
$Juego.rellenarrompe = function()
{
    return rnd = (parseInt(Math.random()*100))%19;
   
}
document.body.onload = function(){$Juego.__construct();}