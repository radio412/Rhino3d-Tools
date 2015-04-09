import os
import scriptcontext
import rhinoscriptsyntax as rs
 
 
print "//export run started/////////////"
 
# this function via mcneel/rhinoscriptsyntax
#https://github.com/mcneel/rhinoscriptsyntax/blob/master/Scripts/rhinoscript/layer.py
def layerNames(sort=False):
    rc = []
    for layer in scriptcontext.doc.Layers:
        if not layer.IsDeleted: rc.append(layer.FullPath)
    if sort: rc.sort()
    return rc
 
def GetDAESettings():
    e_str = ""
    return e_str
 
def GetOBJSettings():
    e_str = "_Geometry=_Mesh "
    e_str+= "_EndOfLine=CRLF "
    e_str+= "_ExportRhinoObjectNames=_ExportObjectsAsOBJGroups "
    e_str+= "_ExportMeshTextureCoordinates=_Yes "
    e_str+= "_ExportMeshVertexNormals=_No "
    e_str+= "_CreateNGons=_No "
    e_str+= "_ExportMaterialDefinitions=_No "
    e_str+= "_YUp=_No "
    e_str+= "_WrapLongLines=Yes "
    e_str+= "_VertexWelding=_Welded "
    e_str+= "_WritePrecision=4 "
    e_str+= "_Enter "
 
    e_str+= "_DetailedOptions "
    e_str+= "_JaggedSeams=_No "
    e_str+= "_PackTextures=_No "
    e_str+= "_Refine=_Yes "
    e_str+= "_SimplePlane=_No "
 
    e_str+= "_AdvancedOptions "
    e_str+= "_Angle=50 "
    e_str+= "_AspectRatio=0 "
    e_str+= "_Distance=0.0"
    e_str+= "_Density=0 "
    e_str+= "_Density=0.45 "
    e_str+= "_Grid=0 "
    e_str+= "_MaxEdgeLength=0 "
    e_str+= "_MinEdgeLength=0.0001 "
 
    e_str+= "_Enter _Enter"
 
    return e_str
 
def GetSTLSettings():
    eStr = "_ExportFileAs=_Binary "
    eStr+= "_ExportUnfinishedObjects=_Yes "
    eStr+= "_UseSimpleDialog=_No "
    eStr+= "_UseSimpleParameters=_No "
    eStr+= "_Enter _DetailedOptions "
    eStr+= "_JaggedSeams=_No "
    eStr+= "_PackTextures=_No "
    eStr+= "_Refine=_Yes "
    eStr+= "_SimplePlane=_No "
    eStr+= "_AdvancedOptions "
    eStr+= "_Angle=15 "
    eStr+= "_AspectRatio=0 "
    eStr+= "_Distance=0.01 "
    eStr+= "_Grid=16 "
    eStr+= "_MaxEdgeLength=0 "
    eStr+= "_MinEdgeLength=0.0001 "
    eStr+= "_Enter _Enter"
    return eStr
 
settingsList = {
    'GetDAESettings': GetDAESettings,
    'GetOBJSettings': GetOBJSettings,
    'GetSTLSettings': GetSTLSettings
}
 
 
 
 
fileName = rs.DocumentName()
filePath = rs.DocumentPath().rstrip(fileName)
 
arrLayers = layerNames(False)
 
 
 
def initExportByLayer(fileType="obj", visibleonly=False, byObject=False):
    for layerName in arrLayers:
        layer = scriptcontext.doc.Layers.FindByFullPath(layerName, True)
        if layer >= 0:
            layer = scriptcontext.doc.Layers[layer]
            save = True;
            if visibleonly:
                if not layer.IsVisible:
                    save = False
            if  rs.IsLayerEmpty(layerName):
                save = False
            if save:
                cutName = layerName.split("::")
                cutName = cutName[len(cutName)-1]
                objs = scriptcontext.doc.Objects.FindByLayer(cutName)
                if len(objs) > 0:
                    if byObject:
                        i=0
                        for obj in objs:
                            i= i+1
                            saveObjectsToFile(cutName+"_"+str(i), [obj], fileType)
                    else:
                        saveObjectsToFile(cutName, objs, fileType)
 
 
 
def saveObjectsToFile(name, objs, fileType):
    rs.EnableRedraw(False)
    if len(objs) > 0:
        settings = settingsList["Get"+fileType.upper()+"Settings"]()
        rs.UnselectAllObjects()
        for obj in objs:
            obj.Select(True)
        name = "".join(name.split(" "))
        command = '-_Export "{}{}{}" {}'.format(filePath, name, "."+fileType.lower(), settings)
        rs.Command(command, True)
        rs.EnableRedraw(True)
 
 
initExportByLayer("obj",True, False)
initExportByLayer("dae",True, False)
initExportByLayer("stl",True, False)
 
print "//export run ended/////////////"
