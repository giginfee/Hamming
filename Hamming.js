
class Hamming {
    V=[]
    byteArr=[]
    controlBitsNumbers=[]
    constructor(r) {
        this.r = r;
        this.k=Math.pow(2,this.r)-this.r-1
        this.initVmatrix();
        this.output = '';
        this.getControlBitsNumbers()
    }

    encode(string){
        this.byteArr=this.initByteArrFromString(string,this.k)

        let res=""
        for(let str of this.byteArr){
            this.encodeByteArr(str)
            res+=this.output
        }


        return res
    }
    decode(string){
        let maxlen=Math.pow(2,this.r)-1
        let fullByteString=""
        while (string!==""){
            let d=string.length
            let curr=string.slice(maxlen*(-1))
            string=string.slice(0,maxlen*(-1))
            let code=this.decodeToByteArray(curr)
            fullByteString=code+fullByteString
        }
        while(fullByteString[0]==="0"){
            fullByteString=fullByteString.slice(1)
        }
        return this.retrieveChars(fullByteString)

    }
    retrieveChars(byteString){
        let res=""
        // byteString=byteString.split("")
        while (byteString!=="") {
            let curr=byteString.slice(-8)
            let char = String.fromCharCode(parseInt(curr, 2))
            res=char+res
            byteString=byteString.slice(0,-8)
        }
        return res
    }
    encodeByteArr(bytes){
        this.output=""
        if(bytes.length!==this.k)
            return Error(`Wrong length, should be ${this.k}`)

        this.byteArr=[bytes]
        for(let str of this.byteArr)
            this.addControlBitsToBytes(str)
        return this.output
    }

    decodeToByteArray(string){
        if(string.length!==Math.pow(2,this.r)-1)
            return Error(`Wrong length, should be ${Math.pow(2,this.r)-1}`)
        this.encodedByteArray=string.split("").map(x=>Number(x))
        let byteArrayAsShouldBe=this.findMistakeAndFixArray(string)
        let mistakeFound=byteArrayAsShouldBe.join("")!==this.encodedByteArray.join("")
        if (!mistakeFound){
            return this.reduceArrFromControlBits(byteArrayAsShouldBe)
        }else{
            let numberOfWrongBit=0
            for(let cntrBitNum of this.controlBitsNumbers.slice().reverse()){
                if(byteArrayAsShouldBe[cntrBitNum-1]!==this.encodedByteArray[cntrBitNum-1])
                numberOfWrongBit+=cntrBitNum
            }
            if(this.encodedByteArray[numberOfWrongBit-1]===0)
                this.encodedByteArray[numberOfWrongBit-1]=1
            else
                this.encodedByteArray[numberOfWrongBit-1]=0
            return this.reduceArrFromControlBits(this.encodedByteArray)
        }


    }

    reduceArrFromControlBits(array){
        let arr=array.slice()
        for(let cntrBitNum of this.controlBitsNumbers.slice().reverse())
            arr.splice(cntrBitNum-1,1)
        return arr.join("")
    }
    findMistakeAndFixArray(){
        let newArr=this.encodedByteArray.slice()
        for(let num of this.controlBitsNumbers)
            newArr[num-1]=0
        let xValues=(this.multiplyMatrices([newArr],this.V)[0]).slice().reverse()
        let i=0
        for(let cntrBitNum of this.controlBitsNumbers){
            newArr[cntrBitNum-1]=xValues[i]%2
            i++
        }
        return newArr
    }
    addControlBitsToBytes(str){
        let C=str.split("").map(x=>Number(x))
        for(let cntrBitNum of this.controlBitsNumbers)
            C.splice(cntrBitNum-1,0,0)
        let xValues=(this.multiplyMatrices([C],this.V)[0]).slice().reverse()
        let i=0
        for(let cntrBitNum of this.controlBitsNumbers){
            C[cntrBitNum-1]=xValues[i]%2
            i++
        }
        this.output+=C.join("")
    }


    initVmatrix(){
        let Vlen=Math.pow(2,this.r)-1
        let len=Vlen.toString(2).length
        for (let i=Vlen; i>0;i--){
            let arr=(Array(len-i.toString(2).length+1).join("0")+i.toString(2)).split("").map(x=> Number(x))
            this.V.unshift(arr)

        }
    }
     #textToBin(text) {
        var length = text.length,
            output = [];
        for (let i = 0;i < length; i++) {
            let bin = text[i].charCodeAt().toString(2);
            output.push(Array(8-bin.length+1).join("0") + bin);
        }
        return output.join("");
    }
     initByteArrFromString(string,maxlen){
        let stringBytes=this.#textToBin(string)
        let array=[]
        while (stringBytes!==""){
            let curr=stringBytes.slice(maxlen*(-1))
            array.unshift(Array(maxlen-curr.length+1).join("0") +curr )
            stringBytes=stringBytes.slice(0,maxlen*(-1))
        }
        return array
    }
    getControlBitsNumbers(){
        for(let i =1;i<=this.k;i++){
            if(this.isPow2(i))
                this.controlBitsNumbers.push(i)
        }
    }
    isPow2(number){

        return  Math.log2(number)-Math.floor(Math.log2(number))===0
    }
    multiplyMatrices(a, b) {
        var aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);
        for (var r = 0; r < aNumRows; ++r) {
            m[r] = new Array(bNumCols);
            for (var c = 0; c < bNumCols; ++c) {
                m[r][c] = 0;
                for (var i = 0; i < aNumCols; ++i) {
                    m[r][c] += a[r][i] * b[i][c];
                }
            }
        }
        return m;
    }

}

const encoder = new Hamming(4);
console.log("Encoded: ",encoder.encode("abcd"))
console.log("Decoded: ",encoder.decode("010001100000101111000011001100100111011100101"))

console.log(encoder.encodeByteArr("00000000000"))
console.log(encoder.decodeToByteArray("000000000000001"))




